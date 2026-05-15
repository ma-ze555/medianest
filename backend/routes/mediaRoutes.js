const express = require("express");
const router = express.Router();
const {
  getMediaEntries,
  getMediaEntry,
  createMediaEntry,
  updateMediaEntry,
  deleteMediaEntry,
  getStats,
} = require("../controllers/mediaController");
const { protect } = require("../middleware/authMiddleware");

router.get("/stats", protect, getStats);
router.route("/").get(protect, getMediaEntries).post(protect, createMediaEntry);
router
  .route("/:id")
  .get(protect, getMediaEntry)
  .put(protect, updateMediaEntry)
  .delete(protect, deleteMediaEntry);

module.exports = router;
