const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  chit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chit',
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  winner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  bid_amount: {
    type: Number,
    required: true
  },
  prize_amount: {
    type: Number,
    required: true
  },
  dividend_amount: {
    type: Number,
    default: 0
  },
  auction_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'disbursed'],
    default: 'pending'
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

module.exports = mongoose.model('Bid', bidSchema);
