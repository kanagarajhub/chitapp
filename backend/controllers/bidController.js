const Bid = require('../models/Bid');
const Chit = require('../models/Chit');

// @desc    Get all bids
// @route   GET /api/bids
// @access  Private
exports.getBids = async (req, res) => {
  try {
    const { chit_id } = req.query;
    let query = {};

    if (chit_id) query.chit_id = chit_id;

    const bids = await Bid.find(query)
      .populate('chit_id', 'chit_name')
      .populate('winner_id', 'name phone')
      .populate('recordedBy', 'name')
      .sort('-auction_date');

    res.status(200).json({ success: true, count: bids.length, data: bids });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single bid
// @route   GET /api/bids/:id
// @access  Private
exports.getBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate('chit_id', 'chit_name')
      .populate('winner_id', 'name phone email')
      .populate('recordedBy', 'name email');

    if (!bid) {
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }

    res.status(200).json({ success: true, data: bid });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create bid
// @route   POST /api/bids
// @access  Private (Admin, Accountant)
exports.createBid = async (req, res) => {
  try {
    // Verify chit exists
    const chit = await Chit.findById(req.body.chit_id);
    if (!chit) {
      return res.status(404).json({ success: false, message: 'Chit not found' });
    }

    // Verify winner is member of chit
    const isMember = chit.members.some(
      member => member.customer_id.toString() === req.body.winner_id
    );

    if (!isMember) {
      return res.status(400).json({ success: false, message: 'Winner is not a member of this chit' });
    }

    // Check if bid already exists for this month
    const existingBid = await Bid.findOne({
      chit_id: req.body.chit_id,
      month: req.body.month
    });

    if (existingBid) {
      return res.status(400).json({ success: false, message: 'Bid already exists for this month' });
    }

    req.body.recordedBy = req.user.id;
    const bid = await Bid.create(req.body);

    // Update chit current month
    chit.current_month = req.body.month + 1;
    await chit.save();

    res.status(201).json({ success: true, data: bid });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update bid
// @route   PUT /api/bids/:id
// @access  Private (Admin, Accountant)
exports.updateBid = async (req, res) => {
  try {
    const bid = await Bid.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!bid) {
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }

    res.status(200).json({ success: true, data: bid });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete bid
// @route   DELETE /api/bids/:id
// @access  Private (Admin)
exports.deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findByIdAndDelete(req.params.id);
    if (!bid) {
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }
    res.status(200).json({ success: true, message: 'Bid deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
