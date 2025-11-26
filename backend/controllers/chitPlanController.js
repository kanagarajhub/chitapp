const ChitPlan = require('../models/ChitPlan');

// @desc    Get all chit plans
// @route   GET /api/chitplans
// @access  Private
exports.getChitPlans = async (req, res) => {
  try {
    const plans = await ChitPlan.find().populate('createdBy', 'name email').sort('-createdAt');
    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single chit plan
// @route   GET /api/chitplans/:id
// @access  Private
exports.getChitPlan = async (req, res) => {
  try {
    const plan = await ChitPlan.findById(req.params.id).populate('createdBy', 'name email');
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Chit plan not found' });
    }
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create chit plan
// @route   POST /api/chitplans
// @access  Private (Admin, Accountant)
exports.createChitPlan = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const plan = await ChitPlan.create(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update chit plan
// @route   PUT /api/chitplans/:id
// @access  Private (Admin, Accountant)
exports.updateChitPlan = async (req, res) => {
  try {
    const plan = await ChitPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Chit plan not found' });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete chit plan
// @route   DELETE /api/chitplans/:id
// @access  Private (Admin)
exports.deleteChitPlan = async (req, res) => {
  try {
    const plan = await ChitPlan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Chit plan not found' });
    }
    res.status(200).json({ success: true, message: 'Chit plan deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
