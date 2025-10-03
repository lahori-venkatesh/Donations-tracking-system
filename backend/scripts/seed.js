#!/usr/bin/env node

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { seedDatabase, clearDatabase } = require('../src/utils/seedDatabase');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/donatetrack');
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

const main = async () => {
  const command = process.argv[2];

  await connectDB();

  try {
    switch (command) {
      case 'seed':
        await seedDatabase();
        break;
      case 'clear':
        await clearDatabase();
        break;
      case 'reset':
        await clearDatabase();
        await seedDatabase();
        break;
      default:
        console.log('📖 Usage:');
        console.log('  npm run db:seed   - Seed database with test data');
        console.log('  npm run db:clear  - Clear all data from database');
        console.log('  npm run db:reset  - Clear and reseed database');
        break;
    }
  } catch (error) {
    console.error('❌ Operation failed:', error);
    process.exit(1);
  }

  await mongoose.connection.close();
  console.log('📦 Database connection closed');
  process.exit(0);
};

main();