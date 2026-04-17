// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_resource_allocation';

  try {
    const conn = await mongoose.connect(uri, {
      // Mongoose 8+ has these on by default, but explicit is safer
      serverSelectionTimeoutMS: 10000, // timeout after 10 s if Mongo is unreachable
      socketTimeoutMS: 45000,
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);

    // Graceful shutdown hooks
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌  MongoDB connection closed (SIGINT).');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      console.log('🔌  MongoDB connection closed (SIGTERM).');
      process.exit(0);
    });
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
