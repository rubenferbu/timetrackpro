const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { runSeed } = require('../src/seed/seed');
const Company = require('../src/models/Company');
const User = require('../src/models/User');
const TimeEntry = require('../src/models/TimeEntry');
const LeaveRequest = require('../src/models/LeaveRequest');

async function main() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  const summary = await runSeed({ uri });

  console.log('\n--- Comprobaciones de integridad ---');

  const totalUsers = await User.countDocuments();
  const totalCompanies = await Company.countDocuments();
  console.log(`Total companies en BD: ${totalCompanies} (esperado ${summary.companies})`);
  console.log(`Total users en BD: ${totalUsers} (esperado ${summary.users})`);

  // 1. Todo TimeEntry debe apuntar a un userId y companyId que existen de verdad.
  const orphanTimeEntries = await TimeEntry.countDocuments({
    $or: [{ userId: null }, { companyId: null }],
  });
  console.log(`Fichajes huérfanos (sin user o company resuelto): ${orphanTimeEntries}`);

  // 2. Todo manager referenciado en managerId debe existir y pertenecer a la misma empresa.
  const usersWithManager = await User.find({ managerId: { $ne: null } }).populate('managerId', 'companyId role');
  const mismatched = usersWithManager.filter(
    (u) => !u.managerId || String(u.managerId.companyId) !== String(u.companyId)
  );
  console.log(`Usuarios con managerId de otra empresa (debería ser 0): ${mismatched.length}`);

  // 3. Comprobación de un usuario concreto de punta a punta.
  const sampleUser = await User.findOne({ role: 'employee' }).populate('companyId', 'name').populate('managerId', 'name email');
  console.log('\nEjemplo de usuario poblado:');
  console.log(`  ${sampleUser.name} (${sampleUser.email}) - empresa: ${sampleUser.companyId.name} - manager: ${sampleUser.managerId?.name}`);

  const sampleEntry = await TimeEntry.findOne({ userId: sampleUser._id }).sort({ clockIn: -1 });
  console.log(`  Último fichaje: ${sampleEntry.clockIn.toISOString()} -> ${sampleEntry.clockOut?.toISOString()} (${sampleEntry.durationMinutes} min)`);

  // 4. La contraseña debe estar hasheada, nunca en texto plano.
  const userWithPassword = await User.findOne({ email: sampleUser.email }).select('+password');
  const isHashed = userWithPassword.password.startsWith('$2');
  console.log(`  Password hasheada correctamente (bcrypt): ${isHashed}`);
  const matches = await userWithPassword.comparePassword('Password123!');
  console.log(`  comparePassword('Password123!') funciona: ${matches}`);

  const leaveSample = await LeaveRequest.findOne({ status: { $ne: 'pending' } }).populate('approvedBy', 'name role');
  console.log(`\nEjemplo de solicitud resuelta: estado=${leaveSample.status}, aprobada por ${leaveSample.approvedBy?.name} (${leaveSample.approvedBy?.role})`);

  await mongoose.disconnect();
  await mongod.stop();

  const ok = orphanTimeEntries === 0 && mismatched.length === 0 && isHashed && matches;
  console.log(`\nRESULTADO: ${ok ? 'TODO CORRECTO' : 'HAY PROBLEMAS QUE REVISAR'}`);
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error('Fallo en el test de seed:', err);
  process.exit(1);
});
