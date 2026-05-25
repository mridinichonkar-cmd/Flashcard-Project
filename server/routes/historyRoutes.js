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

router.post("/log", authMiddleware, async (req, res) => {
  try {
    const { flashcardId, action } = req.body;
    const entry = new LearningHistory({
      userId: req.userId,
      flashcardId,
      action,
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Failed to log history" });
  }
});

module.exports = router;