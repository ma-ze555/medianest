const express = require("express");
const router = express.Router();
const {
  searchAnime,
  searchMovie,
  searchSeries,
  searchNovel,
  searchMusic,
} = require("../controllers/searchController");
const { protect } = require("../middleware/authMiddleware");

router.get("/anime", protect, searchAnime);
router.get("/movie", protect, searchMovie);
router.get("/series", protect, searchSeries);
router.get("/novel", protect, searchNovel);
router.get("/music", protect, searchMusic);

module.exports = router;
