const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getChitReport,
  getCustomerReport,
  exportPayments
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/chit/:id', getChitReport);
router.get('/customer/:id', getCustomerReport);
router.get('/export/payments', exportPayments);

module.exports = router;
