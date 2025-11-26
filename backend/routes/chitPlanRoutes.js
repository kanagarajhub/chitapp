const express = require('express');
const router = express.Router();
const {
  getChitPlans,
  getChitPlan,
  createChitPlan,
  updateChitPlan,
  deleteChitPlan
} = require('../controllers/chitPlanController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getChitPlans)
  .post(authorize('admin', 'accountant'), createChitPlan);

router.route('/:id')
  .get(getChitPlan)
  .put(authorize('admin', 'accountant'), updateChitPlan)
  .delete(authorize('admin'), deleteChitPlan);

module.exports = router;
