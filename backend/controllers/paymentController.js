const Payment = require('../models/Payment');
const Chit = require('../models/Chit');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res) => {
  try {
    const { chit_id, customer_id, status } = req.query;
    let query = {};

    if (chit_id) query.chit_id = chit_id;
    if (customer_id) query.customer_id = customer_id;
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('chit_id', 'chit_name')
      .populate('customer_id', 'name phone')
      .populate('recordedBy', 'name')
      .sort('-payment_date');

    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('chit_id', 'chit_name')
      .populate('customer_id', 'name phone email')
      .populate('recordedBy', 'name email');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res) => {
  try {
    // Verify chit exists
    const chit = await Chit.findById(req.body.chit_id);
    if (!chit) {
      return res.status(404).json({ success: false, message: 'Chit not found' });
    }

    // Verify customer is member of chit
    const isMember = chit.members.some(
      member => member.customer_id.toString() === req.body.customer_id
    );

    if (!isMember) {
      return res.status(400).json({ success: false, message: 'Customer is not a member of this chit' });
    }

    req.body.recordedBy = req.user.id;
    const payment = await Payment.create(req.body);

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private (Admin)
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.status(200).json({ success: true, message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get pending payments
// @route   GET /api/payments/pending/all
// @access  Private
exports.getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: { $in: ['pending', 'overdue'] } })
      .populate('chit_id', 'chit_name')
      .populate('customer_id', 'name phone')
      .sort('due_date');

    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
