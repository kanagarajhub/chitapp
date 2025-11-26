const express = require('express');
const router = express.Router();
const {
  getBids,
  getBid,
  createBid,
  updateBid,
  deleteBid
} = require('../controllers/bidController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getBids)
  .post(authorize('admin', 'accountant'), createBid);

router.route('/:id')
  .get(getBid)
  .put(authorize('admin', 'accountant'), updateBid)
  .delete(authorize('admin'), deleteBid);

module.exports = router;
