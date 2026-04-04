const express = require("express");
const cors = require("cors");

const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

app.get("/api/flashcards", async(req, res) => {
    try {
    const flashcards = await Flashcard.find();
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flashcards" });
  }
});

app.post("/api/flashcards", async(req, res) => {
  try{
    const {question, answer} = req.body;
    const newFlashcard = new Flashcard({question, answer});
    const savedFlashcard = await newFlashcard.save();

    res.status(201).json(savedFlashcard);
  }catch (error){
    res.status(500).json({ error: "Failed to create flashcard"});

  }
});

app.delete("/api/flashcards/:id", async (req, res) => {
  try{
    await Flashcard.findByIdAndDelete(req.params.id);
    res.json({message: "Flashcard deleted"});
  }catch (error){
    res.status(500).json({error:"Failed to delete flashcard"});
  }
});


app.put("/api/flashcards/:id", async (req, res) => {
  try{
    const {question, answer} = req.body;
    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      {question, answer},
      {new: true}
    );
    res.json(updatedFlashcard);
  } catch (error){
    res.status(500).json({error: "Failed to update flashcard"});
  }
  });
  
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=> (
    console.log(`Server is running on port ${PORT}`)
))
