require('dotenv').config();
const { connectDB, isConnected } = require('./db');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');
const Notification = require('./models/Notification');
const fs = require('fs');
const path = require('path');

async function seedDatabaseIfEmpty() {
  if (!isConnected()) {
    console.log('⚠️ MongoDB not connected. Skipping database seeding.');
    return;
  }

  try {
    // 1. Seed or Update Super Admin User (dev.shubhamagrawal@gmail.com)
    let superAdmin = await User.findOne({
      $or: [
        { email: 'dev.shubhamagrawal@gmail.com' },
        { phone: 'dev.shubhamagrawal@gmail.com' },
        { phone: '9999999999', role: 'SUPER_ADMIN' }
      ]
    });

    if (!superAdmin) {
      console.log('🌱 Seeding Super Admin user (dev.shubhamagrawal@gmail.com)...');
      superAdmin = new User({
        email: 'dev.shubhamagrawal@gmail.com',
        phone: '9999999999',
        name: 'Shubham Agrawal',
        password: '$hubh@Achuki23',
        role: 'SUPER_ADMIN',
        status: 'APPROVED',
        permissions: ['ALL'],
      });
      await superAdmin.save();
      console.log('✅ Super Admin seeded (dev.shubhamagrawal@gmail.com)');
    } else {
      superAdmin.email = 'dev.shubhamagrawal@gmail.com';
      superAdmin.name = 'Shubham Agrawal';
      superAdmin.role = 'SUPER_ADMIN';
      superAdmin.status = 'APPROVED';
      superAdmin.permissions = ['ALL'];
      superAdmin.password = '$hubh@Achuki23';
      await superAdmin.save();
      console.log('✅ Super Admin credentials updated (dev.shubhamagrawal@gmail.com)');
    }

    console.log('🎉 Super Admin check complete. Database ready for dynamic records.');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  }
}

// Support direct command-line execution: node server/seed.js
if (require.main === module) {
  (async () => {
    await connectDB();
    await seedDatabaseIfEmpty();
    process.exit(0);
  })();
}

module.exports = { seedDatabaseIfEmpty };
