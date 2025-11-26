const Chit = require('../models/Chit');
const ChitPlan = require('../models/ChitPlan');

// @desc    Get all chits
// @route   GET /api/chits
// @access  Private
exports.getChits = async (req, res) => {
  try {
    const chits = await Chit.find()
      .populate('chit_plan_id')
      .populate('members.customer_id', 'name phone email')
      .populate('createdBy', 'name email')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: chits.length, data: chits });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single chit
// @route   GET /api/chits/:id
// @access  Private
exports.getChit = async (req, res) => {
  try {
    const chit = await Chit.findById(req.params.id)
      .populate('chit_plan_id')
      .populate('members.customer_id', 'name phone email')
      .populate('createdBy', 'name email');
    
    if (!chit) {
      return res.status(404).json({ success: false, message: 'Chit not found' });
    }
    res.status(200).json({ success: true, data: chit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create chit
// @route   POST /api/chits
// @access  Private (Admin, Accountant)
exports.createChit = async (req, res) => {
  try {
    const plan = await ChitPlan.findById(req.body.chit_plan_id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Chit plan not found' });
    }

    req.body.createdBy = req.user.id;
    req.body.total_amount = plan.amount;
    
    const chit = await Chit.create(req.body);
    res.status(201).json({ success: true, data: chit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update chit
// @route   PUT /api/chits/:id
// @access  Private (Admin, Accountant)
exports.updateChit = async (req, res) => {
  try {
    const chit = await Chit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!chit) {
      return res.status(404).json({ success: false, message: 'Chit not found' });
    }

    res.status(200).json({ success: true, data: chit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Add member to chit
// @route   POST /api/chits/:id/members
// @access  Private
exports.addMember = async (req, res) => {
  try {
    const chit = await Chit.findById(req.params.id).populate('chit_plan_id');
    
    if (!chit) {
      return res.status(404).json({ success: false, message: 'Chit not found' });
    }

    if (chit.members.length >= chit.chit_plan_id.members_limit) {
      return res.status(400).json({ success: false, message: 'Member limit reached' });
    }

    chit.members.push(req.body);
    await chit.save();

    res.status(200).json({ success: true, data: chit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Remove member from chit
// @route   DELETE /api/chits/:id/members/:memberId
// @access  Private (Admin)
exports.removeMember = async (req, res) => {
  try {
    const chit = await Chit.findById(req.params.id);
    
    if (!chit) {
      return res.status(404).json({ success: false, message: 'Chit not found' });
    }

    chit.members = chit.members.filter(
      member => member._id.toString() !== req.params.memberId
    );
    
    await chit.save();

    res.status(200).json({ success: true, data: chit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete chit
// @route   DELETE /api/chits/:id
// @access  Private (Admin)
exports.deleteChit = async (req, res) => {
  try {
    const chit = await Chit.findByIdAndDelete(req.params.id);
    if (!chit) {
      return res.status(404).json({ success: false, message: 'Chit not found' });
    }
    res.status(200).json({ success: true, message: 'Chit deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
