const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  deck:{
    type: String,
    default: "General",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true},

}, { timestamps: true });

module.exports = mongoose.model("Flashcard", flashcardSchema);