const mongoose = require("mongoose");

const mediaEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Category: anime | movie | series | music | novel
    category: {
      type: String,
      enum: ["anime", "movie", "series", "music", "novel"],
      required: true,
    },

    // Basic info (can be auto-filled from API or manually entered)
    title: { type: String, required: true, trim: true },
    coverImage: { type: String, default: "" },
    genres: [{ type: String }],
    description: { type: String, default: "" },
    externalId: { type: String, default: "" }, // ID from TMDB / Jikan / Google Books

    // Status
    status: {
      type: String,
      enum: ["plan_to", "in_progress", "completed", "dropped", "on_hold"],
      default: "plan_to",
    },

    // Progress tracking
    progress: {
      current: { type: Number, default: 0 }, // episode / chapter / page / track
      total: { type: Number, default: 0 },   // total episodes / chapters / pages
    },

    // For series/anime: season tracking
    currentSeason: { type: Number, default: 1 },

    // User rating (1-10)
    rating: { type: Number, min: 1, max: 10, default: null },

    // Personal review/notes
    review: { type: String, default: "" },

    // Favorite flag
    isFavorite: { type: Boolean, default: false },

    // Date completed
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MediaEntry", mediaEntrySchema);
