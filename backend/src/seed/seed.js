require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');

const { connectDB, disconnectDB } = require('../config/db');
const Company = require('../models/Company');
const User = require('../models/User');
const TimeEntry = require('../models/TimeEntry');
const LeaveRequest = require('../models/LeaveRequest');

const DATA_DIR = path.join(__dirname, 'data');

function readCSV(fileName) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(path.join(DATA_DIR, fileName))
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

async function seedCompanies() {
  const rows = await readCSV('companies.csv');
  const companyIdByName = new Map();

  for (const row of rows) {
    const company = await Company.create({
      name: row.name,
      plan: row.plan,
      status: row.status,
      settings: {
        annualVacationDays: Number(row.annualVacationDays),
        workHoursPerDay: Number(row.workHoursPerDay),
      },
    });
    companyIdByName.set(row.name, company._id);
  }

  return companyIdByName;
}

async function seedUsers(companyIdByName) {
  const rows = await readCSV('users.csv');
  const userIdByEmail = new Map();

  // Primera pasada: crear usuarios sin managerId (el manager puede no existir todavía).
  for (const row of rows) {
    const user = await User.create({
      name: row.name,
      email: row.email,
      password: row.password,
      role: row.role,
      companyId: row.companyName ? companyIdByName.get(row.companyName) : null,
    });
    userIdByEmail.set(row.email, user._id);
  }

  // Segunda pasada: ahora que todos existen, resolvemos managerEmail -> managerId.
  for (const row of rows) {
    if (!row.managerEmail) continue;
    await User.updateOne(
      { email: row.email },
      { managerId: userIdByEmail.get(row.managerEmail) }
    );
  }

  return userIdByEmail;
}

async function seedTimeEntries(companyIdByName, userIdByEmail) {
  const rows = await readCSV('time_entries.csv');
  const docs = rows.map((row) => ({
    companyId: companyIdByName.get(row.companyName),
    userId: userIdByEmail.get(row.userEmail),
    clockIn: new Date(row.clockIn),
    clockOut: row.clockOut ? new Date(row.clockOut) : null,
    notes: row.notes || '',
  }));
  await TimeEntry.insertMany(docs);
  return docs.length;
}

async function seedLeaveRequests(companyIdByName, userIdByEmail) {
  const rows = await readCSV('leave_requests.csv');
  const docs = rows.map((row) => ({
    companyId: companyIdByName.get(row.companyName),
    userId: userIdByEmail.get(row.userEmail),
    type: row.type,
    startDate: new Date(row.startDate),
    endDate: new Date(row.endDate),
    status: row.status,
    approvedBy: row.approvedByEmail ? userIdByEmail.get(row.approvedByEmail) : null,
  }));
  await LeaveRequest.insertMany(docs);
  return docs.length;
}

async function clearCollections() {
  await Promise.all([
    Company.deleteMany({}),
    User.deleteMany({}),
    TimeEntry.deleteMany({}),
    LeaveRequest.deleteMany({}),
  ]);
}

async function runSeed({ uri } = {}) {
  await connectDB(uri);
  console.log('Limpiando colecciones existentes...');
  await clearCollections();

  console.log('Sembrando companies...');
  const companyIdByName = await seedCompanies();

  console.log('Sembrando users...');
  const userIdByEmail = await seedUsers(companyIdByName);

  console.log('Sembrando time entries...');
  const timeEntryCount = await seedTimeEntries(companyIdByName, userIdByEmail);

  console.log('Sembrando leave requests...');
  const leaveRequestCount = await seedLeaveRequests(companyIdByName, userIdByEmail);

  const summary = {
    companies: companyIdByName.size,
    users: userIdByEmail.size,
    timeEntries: timeEntryCount,
    leaveRequests: leaveRequestCount,
  };

  console.log('Seed completado:', summary);
  return summary;
}

// Permite ejecutar `npm run seed` directamente, o importar runSeed() desde un test.
if (require.main === module) {
  runSeed()
    .then(() => disconnectDB())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Error en el seed:', err);
      process.exit(1);
    });
}

module.exports = { runSeed };
