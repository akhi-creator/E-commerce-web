const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const User = require('../models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@shopverse.com' });

        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email: admin@shopverse.com');
            console.log('Password: admin123');

            // Update role to admin if not already
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('Updated user role to admin');
            }
        } else {
            // Create admin user
            const admin = await User.create({
                name: 'Admin User',
                email: 'admin@shopverse.com',
                password: 'admin123',
                role: 'admin'
            });

            console.log('Admin user created successfully!');
            console.log('Email: admin@shopverse.com');
            console.log('Password: admin123');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
