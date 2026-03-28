const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Running server!");
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
    }
  ]);
});