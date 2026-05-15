const MediaEntry = require("../models/MediaEntry");

// @desc    Get all media entries for logged in user
// @route   GET /api/media
// @access  Private
const getMediaEntries = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filter = { user: req.user._id };

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: "i" };

    const entries = await MediaEntry.find(filter).sort({ updatedAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single media entry
// @route   GET /api/media/:id
// @access  Private
const getMediaEntry = async (req, res) => {
  try {
    const entry = await MediaEntry.findById(req.params.id);

    if (!entry) return res.status(404).json({ message: "Entry not found" });

    // Make sure the entry belongs to the logged in user
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new media entry
// @route   POST /api/media
// @access  Private
const createMediaEntry = async (req, res) => {
  try {
    const entry = await MediaEntry.create({
      user: req.user._id,
      ...req.body,
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a media entry
// @route   PUT /api/media/:id
// @access  Private
const updateMediaEntry = async (req, res) => {
  try {
    const entry = await MediaEntry.findById(req.params.id);

    if (!entry) return res.status(404).json({ message: "Entry not found" });

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // If status is being set to completed, record the date
    if (req.body.status === "completed" && entry.status !== "completed") {
      req.body.completedAt = new Date();
    }

    const updatedEntry = await MediaEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a media entry
// @route   DELETE /api/media/:id
// @access  Private
const deleteMediaEntry = async (req, res) => {
  try {
    const entry = await MediaEntry.findById(req.params.id);

    if (!entry) return res.status(404).json({ message: "Entry not found" });

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await entry.deleteOne();
    res.json({ message: "Entry removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stats for logged in user
// @route   GET /api/media/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await MediaEntry.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { category: "$category", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalCompleted = await MediaEntry.countDocuments({
      user: userId,
      status: "completed",
    });

    const favorites = await MediaEntry.countDocuments({
      user: userId,
      isFavorite: true,
    });

    res.json({ stats, totalCompleted, favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMediaEntries,
  getMediaEntry,
  createMediaEntry,
  updateMediaEntry,
  deleteMediaEntry,
  getStats,
};
