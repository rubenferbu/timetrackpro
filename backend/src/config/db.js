const mongoose = require('mongoose');

async function connectDB(uri) {
  const connectionString = uri || process.env.MONGODB_URI;

  if (!connectionString) {
    throw new Error('MONGODB_URI no está definida. Revisa tu archivo .env');
  }

  mongoose.connection.on('error', (err) => {
    console.error('Error de conexión a MongoDB:', err.message);
  });

  await mongoose.connect(connectionString);
  console.log(`MongoDB conectado -> ${mongoose.connection.name}`);
  return mongoose.connection;
}

async function disconnectDB() {
  await mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB };
