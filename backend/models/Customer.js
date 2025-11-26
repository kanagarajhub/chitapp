const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide customer name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    trim: true
  },
  kyc_id: {
    type: String,
    trim: true
  },
  kyc_type: {
    type: String,
    enum: ['aadhaar', 'pan', 'voter_id', 'driving_license', 'other'],
    default: 'aadhaar'
  },
  joined_date: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
