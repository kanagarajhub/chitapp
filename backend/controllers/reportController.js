const Payment = require('../models/Payment');
const Chit = require('../models/Chit');
const Customer = require('../models/Customer');
const Bid = require('../models/Bid');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// @desc    Get dashboard stats
// @route   GET /api/reports/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    // Total collections
    const totalCollected = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Pending dues
    const pendingDues = await Payment.aggregate([
      { $match: { status: { $in: ['pending', 'overdue'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Active chits
    const activeChits = await Chit.countDocuments({ status: 'active' });

    // Total customers
    const totalCustomers = await Customer.countDocuments({ isActive: true });

    // Recent payments
    const recentPayments = await Payment.find({ status: 'paid' })
      .populate('customer_id', 'name')
      .populate('chit_id', 'chit_name')
      .sort('-payment_date')
      .limit(10);

    // Overdue payments
    const overduePayments = await Payment.find({
      status: 'overdue',
      due_date: { $lt: new Date() }
    }).countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalCollected: totalCollected[0]?.total || 0,
        pendingDues: pendingDues[0]?.total || 0,
        activeChits,
        totalCustomers,
        overduePayments,
        recentPayments
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get chit report
// @route   GET /api/reports/chit/:id
// @access  Private
exports.getChitReport = async (req, res) => {
  try {
    const chit = await Chit.findById(req.params.id)
      .populate('chit_plan_id')
      .populate('members.customer_id', 'name phone');

    if (!chit) {
      return res.status(404).json({ success: false, message: 'Chit not found' });
    }

    // Get all payments for this chit
    const payments = await Payment.find({ chit_id: req.params.id })
      .populate('customer_id', 'name');

    // Get all bids for this chit
    const bids = await Bid.find({ chit_id: req.params.id })
      .populate('winner_id', 'name');

    // Calculate totals
    const totalPaid = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = payments
      .filter(p => p.status === 'pending' || p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        chit,
        payments,
        bids,
        totalPaid,
        totalPending
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get customer report
// @route   GET /api/reports/customer/:id
// @access  Private
exports.getCustomerReport = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Get all chits for this customer
    const chits = await Chit.find({ 'members.customer_id': req.params.id })
      .populate('chit_plan_id');

    // Get all payments
    const payments = await Payment.find({ customer_id: req.params.id })
      .populate('chit_id', 'chit_name');

    // Get all wins
    const wins = await Bid.find({ winner_id: req.params.id })
      .populate('chit_id', 'chit_name');

    // Calculate totals
    const totalPaid = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = payments
      .filter(p => p.status === 'pending' || p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        customer,
        chits,
        payments,
        wins,
        totalPaid,
        totalPending
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Export payments to Excel
// @route   GET /api/reports/export/payments
// @access  Private
exports.exportPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('chit_id', 'chit_name')
      .populate('customer_id', 'name phone')
      .sort('-payment_date');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Payments');

    worksheet.columns = [
      { header: 'Receipt No', key: 'receipt_number', width: 15 },
      { header: 'Chit Name', key: 'chit_name', width: 20 },
      { header: 'Customer', key: 'customer', width: 20 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Month', key: 'month', width: 10 },
      { header: 'Amount', key: 'amount', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Payment Date', key: 'payment_date', width: 15 },
      { header: 'Payment Mode', key: 'payment_mode', width: 15 }
    ];

    payments.forEach(payment => {
      worksheet.addRow({
        receipt_number: payment.receipt_number,
        chit_name: payment.chit_id?.chit_name || 'N/A',
        customer: payment.customer_id?.name || 'N/A',
        phone: payment.customer_id?.phone || 'N/A',
        month: payment.month,
        amount: payment.amount,
        status: payment.status,
        payment_date: payment.payment_date.toLocaleDateString(),
        payment_mode: payment.payment_mode
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=payments.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
