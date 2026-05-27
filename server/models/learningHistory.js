const mongoose = require("mongoose");

const leanringHistorySchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    flashcardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flashcard",
        required: true
    },
    action: {
        type: String,
        enum: ["viewed", "answered", "completed"],
        required: true
  }

}, {timestamps: true});

module.exports = mongoose.model("LearningHistory", leanringHistorySchema);