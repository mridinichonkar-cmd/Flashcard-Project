const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/requireAdmin");
const LearningHistory = require("../models/LearningHistory");
const router = express.Router();
const Flashcard = require("../models/Flashcard");

router.get("/view_history", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const flashcards = await Flashcard.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.json(flashcards);
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