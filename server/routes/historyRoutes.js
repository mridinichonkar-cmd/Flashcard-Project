const express = require("express");
const LearningHistory = require("../models/LearningHistory");
const authMiddleware = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();


router.get("/view_history", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const history = await LearningHistory.find()
      .populate("userId", "username email role")
      .populate("flashcardId", "question answer")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch learning history" });
  }
});

module.exports = router;