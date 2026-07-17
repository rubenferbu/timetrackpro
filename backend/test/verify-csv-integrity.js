const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const DATA_DIR = path.join(__dirname, '..', 'src', 'seed', 'data');

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

async function main() {
  const companies = await readCSV('companies.csv');
  const users = await readCSV('users.csv');
  const timeEntries = await readCSV('time_entries.csv');
  const leaveRequests = await readCSV('leave_requests.csv');

  const companyNames = new Set(companies.map((c) => c.name));
  const userEmails = new Set(users.map((u) => u.email));

  const errors = [];

  // 1. Todo usuario con companyName debe apuntar a una empresa que existe.
  for (const u of users) {
    if (u.companyName && !companyNames.has(u.companyName)) {
      errors.push(`Usuario ${u.email} apunta a empresa inexistente: ${u.companyName}`);
    }
    if (u.managerEmail && !userEmails.has(u.managerEmail)) {
      errors.push(`Usuario ${u.email} apunta a manager inexistente: ${u.managerEmail}`);
    }
  }

  // 2. Un manager/employee debe compartir empresa con su manager.
  const companyByEmail = new Map(users.map((u) => [u.email, u.companyName]));
  for (const u of users) {
    if (u.managerEmail && companyByEmail.get(u.managerEmail) !== u.companyName) {
      errors.push(`Usuario ${u.email} tiene un manager de OTRA empresa: ${u.managerEmail}`);
    }
  }

  // 3. Todo fichaje debe apuntar a un userEmail y companyName existentes y coherentes entre sí.
  for (const t of timeEntries) {
    if (!userEmails.has(t.userEmail)) {
      errors.push(`TimeEntry apunta a usuario inexistente: ${t.userEmail}`);
    } else if (companyByEmail.get(t.userEmail) !== t.companyName) {
      errors.push(`TimeEntry de ${t.userEmail} tiene companyName inconsistente: ${t.companyName}`);
    }
    if (new Date(t.clockOut) <= new Date(t.clockIn)) {
      errors.push(`TimeEntry de ${t.userEmail} tiene clockOut <= clockIn`);
    }
  }

  // 4. Toda solicitud de ausencia debe resolver usuario, empresa y (si aplica) aprobador.
  for (const lr of leaveRequests) {
    if (!userEmails.has(lr.userEmail)) {
      errors.push(`LeaveRequest apunta a usuario inexistente: ${lr.userEmail}`);
    }
    if (lr.approvedByEmail && !userEmails.has(lr.approvedByEmail)) {
      errors.push(`LeaveRequest apunta a aprobador inexistente: ${lr.approvedByEmail}`);
    }
    if (lr.status === 'pending' && lr.approvedByEmail) {
      errors.push(`LeaveRequest de ${lr.userEmail} está 'pending' pero tiene aprobador`);
    }
    if (lr.status !== 'pending' && !lr.approvedByEmail) {
      errors.push(`LeaveRequest de ${lr.userEmail} está '${lr.status}' pero SIN aprobador`);
    }
  }

  console.log(`Companies: ${companies.length}`);
  console.log(`Users: ${users.length}`);
  console.log(`TimeEntries: ${timeEntries.length}`);
  console.log(`LeaveRequests: ${leaveRequests.length}`);
  console.log(`\nInconsistencias encontradas: ${errors.length}`);
  errors.slice(0, 20).forEach((e) => console.log(' - ' + e));

  process.exit(errors.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
