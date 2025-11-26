const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  chit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chit',
    required: true
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  payment_date: {
    type: Date,
    default: Date.now
  },
  due_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue', 'partial'],
    default: 'pending'
  },
  payment_mode: {
    type: String,
    enum: ['cash', 'bank_transfer', 'cheque', 'upi', 'card'],
    default: 'cash'
  },
  transaction_id: {
    type: String,
    trim: true
  },
  receipt_number: {
    type: String,
    unique: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  }
}, {
  timestamps: true
});

// Generate receipt number before saving
paymentSchema.pre('save', async function(next) {
  if (!this.receipt_number) {
    const count = await mongoose.model('Payment').countDocuments();
    this.receipt_number = `RCP${Date.now()}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
