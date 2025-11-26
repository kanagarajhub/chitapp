const express = require('express');
const router = express.Router();
const {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  getPendingPayments
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getPayments)
  .post(createPayment);

router.get('/pending/all', getPendingPayments);

router.route('/:id')
  .get(getPayment)
  .put(updatePayment)
  .delete(authorize('admin'), deletePayment);

module.exports = router;
