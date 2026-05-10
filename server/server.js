const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
dotenv.config();

app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));



app.use(express.json());

app.use("/api/auth", authRoutes);

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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

app.get("/api/flashcards", authMiddleware, async(req, res) => {
    try {
    const flashcards = await Flashcard.find({
      user:req.userId
    });
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flashcards" });
  }
});

app.post("/api/flashcards", authMiddleware, async(req, res) => {
  try{
    const {question, answer} = req.body;
    const newFlashcard = new Flashcard({question, answer,user:req.userId});
    const savedFlashcard = await newFlashcard.save();

    res.status(201).json(savedFlashcard);
  }catch (error){
    res.status(500).json({ error: "Failed to create flashcard"});

  }
});

app.delete("/api/flashcards/:id", authMiddleware, async (req, res) => {
  try{
     const deletedFlashcard = await Flashcard.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
  
    });

    if (!deletedFlashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    res.json({ message: "Flashcard deleted" });
  } catch (error) {
      res.status(500).json({ error: "Failed to delete flashcard" });
    }
  });


app.put("/api/flashcards/:id", authMiddleware, async (req, res) => {
  try {
    const { question, answer } = req.body;

    const updatedFlashcard = await Flashcard.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      { question, answer },
      { new: true }
    );

    if (!updatedFlashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    res.json(updatedFlashcard);
  } catch (error) {
    res.status(500).json({ error: "Failed to update flashcard" });
  }
});


  
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=> (
    console.log(`Server is running on port ${PORT}`)
))
