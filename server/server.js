const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Running server!");
});

app.post("/api/flashcards", (req, res) => {
  const newFlashcard = {
    id: Date.now(),
    question: req.body.question,
    answer: req.body.answer
  };
  res.status(201).json(newFlashcard);
});

app.listen(5000,()=> (
    console.log("Server is running on port 5000")
))

app.get("/api/flashcards", (req, res) => {
  res.json([
    {
      id: 1,
      question: "What is HTML?",
      answer: "Markup language"
    },
    {
      id: 2,
      question: "What is CSS?",
      answer: "Styling language"
    },
    {
      id: 3,
      question: "What is JavaScript?",
      answer: "Programming language"
    },
    {
      id: 4,
      question: "What is React?",
      answer: "JavaScript library"
    }
    
  ]);
});