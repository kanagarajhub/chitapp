const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(authorize('admin'), getEmployees);

router.route('/:id')
  .get(getEmployee)
  .put(authorize('admin'), updateEmployee)
  .delete(authorize('admin'), deleteEmployee);

module.exports = router;
