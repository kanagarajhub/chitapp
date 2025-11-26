const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register employee
// @route   POST /api/auth/register
// @access  Private (Admin only)
exports.register = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;

    const employee = await Employee.create({
      name,
      phone,
      email,
      password,
      role
    });

    const token = generateToken(employee._id);

    res.status(201).json({
      success: true,
      data: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        token
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Login employee
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const employee = await Employee.findOne({ email }).select('+password');

    if (!employee) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!employee.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    const isMatch = await employee.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(employee._id);

    res.status(200).json({
      success: true,
      data: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        token
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in employee
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id);
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
