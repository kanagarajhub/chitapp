const express = require('express');
const router = express.Router();
const {
  getChits,
  getChit,
  createChit,
  updateChit,
  addMember,
  removeMember,
  deleteChit
} = require('../controllers/chitController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getChits)
  .post(authorize('admin', 'accountant'), createChit);

router.route('/:id')
  .get(getChit)
  .put(authorize('admin', 'accountant'), updateChit)
  .delete(authorize('admin'), deleteChit);

router.route('/:id/members')
  .post(addMember);

router.route('/:id/members/:memberId')
  .delete(authorize('admin'), removeMember);

module.exports = router;
