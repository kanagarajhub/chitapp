const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const adminExists = await Employee.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await Employee.create({
      name: 'Admin User',
      phone: '1234567890',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedAdmin();
