const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gopratle_events';

  try {
    console.log(`[MongoDB] Connecting to ${uri}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log('[MongoDB] Connected successfully!');
  } catch (err) {
    console.log('[MongoDB] Local instance not reached, starting in-memory database...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
      console.log('[MongoDB] In-memory database connected!');
    } catch (memErr) {
      console.error('[MongoDB] Connection error:', memErr.message);
    }
  }
}

module.exports = connectDB;
