const mongoose = require('mongoose');

const chitPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide plan title'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide chit amount']
  },
  duration: {
    type: Number,
    required: [true, 'Please provide duration in months']
  },
  members_limit: {
    type: Number,
    required: [true, 'Please provide members limit']
  },
  monthly_installment: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ChitPlan', chitPlanSchema);
