const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not defined in .env! Please set your MongoDB Atlas connection string.');
    return false;
  }

  // Obfuscate credentials for safe logging
  const safeUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
  console.log(`🔌 Connecting to MongoDB: ${safeUri}...`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 7000, // Timeout after 7s if Atlas cluster is unreachable
      connectTimeoutMS: 10000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} / ${conn.connection.name}`);
    return true;
  } catch (err) {
    isConnected = false;
    console.error('❌ MongoDB Connection Error:', err.message);
    console.warn('💡 Tip: Make sure your MongoDB Atlas IP Access List allows connections (e.g., 0.0.0.0/0 for development) and your username/password in .env are correct.');
    return false;
  }
}

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️  MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('🔄 MongoDB reconnected.');
});

function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

module.exports = {
  connectDB,
  isConnected: isDbConnected,
  isDbConnected,
  mongoose,
};
