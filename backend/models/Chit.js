const mongoose = require('mongoose');

const chitSchema = new mongoose.Schema({
  chit_plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChitPlan',
    required: true
  },
  chit_name: {
    type: String,
    required: true,
    trim: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date
  },
  members: [{
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    joined_date: {
      type: Date,
      default: Date.now
    },
    ticket_number: {
      type: String,
      required: true
    }
  }],
  current_month: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  total_amount: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Chit', chitSchema);
