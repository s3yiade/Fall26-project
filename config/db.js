// config/db.js
// Connects the app to MongoDB using Mongoose.
// The connection string comes from the MONGO_URI environment variable
// (set in a local .env file, and in Render's Environment settings when deployed),
// so the database password never gets committed to GitHub.

const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('MONGO_URI is not set. Add it to your .env file (see .env.example).');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    // Log the problem instead of crashing, so the error is easy to spot in Render's logs
    console.error('MongoDB connection error:', err.message);
  }
}

module.exports = connectDB;
