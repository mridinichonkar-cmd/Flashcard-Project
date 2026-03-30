import { useState, useEffect } from 'react'
import "./index.css";

function App() {
  const [count, setCount] = useState(0)
  
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  
  useEffect(() => {
    fetch("http://localhost:5000/api/flashcards")
    .then((response) => response.json())
    .then ((data) => {
      setFlashcards(data);
    })
    .catch((error) => {
      console.error("Error fetching flashcards:", error);
    });

  }, []);
   
  const handleCardFlip = (id) => {
    if (!flippedCards.includes(id)) {
      setFlippedCards([...flippedCards, id]);
     } else{
      setFlippedCards(flippedCards.filter((cardId) => cardId !== id));
     }
};

const handleFormSubmit = async (e) => {
  e.preventDefault();

  if (!question.trim() || !answer.trim()) {
    alert("Please fill in both the question and answer fields.");
    return;
  }

  const newFlashcard = {
    question: question.trim(),
    answer: answer.trim(),
  };

    try {
    const response = await fetch("http://localhost:5000/api/flashcards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFlashcard),
    });

    const data = await response.json();
    setFlashcards([...flashcards, data]);
    setQuestion("");
    setAnswer("");


    
  } catch (error) {
    console.error("Error creating flashcard:", error);
  }
};


const handleDelete = async (id) => {
  try{
    const response = await fetch(`http://localhost:5000/api/flashcards/${id}`, {
      method: "DELETE",
    });

    if (!response.ok){
      throw new Error("Failed to delete flashcard");
    }

    setFlashcards((prevFlashcards) => prevFlashcards.filter((card) => card.id !== id));
      
  } catch (error) {
    console.error("Error deleting flashcard:", error);
  }
};

  return (
    <div className = "app">
      <header className="app-header">
        <h1>Flashcard App</h1>
      </header>
    
    <section className="form-section">
      <h2>Create a Flashcard</h2>

      <form className="flashcard-form" onSubmit={handleFormSubmit}>
        <input type="text" placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <input type="text" placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <button type="submit">Add Flashcard</button>
      </form>
    </section>


    <section className="flashcard-section">
      <h2>My Flashcards</h2>
      <div className="flashcard-container">
      {flashcards.map((card)=> (
        <div 
        className="flashcard"
        key={card.id}
        onClick={() => handleCardFlip(card.id)}
        style={{
          border: "1px solid black",
          padding: "20px",
          margin: "10px",
          cursor: "pointer",}}
        >
        <h2>{card.question}</h2>
        {flippedCards.includes(card.id) && <p>{card.answer}</p>}

        <button className= "deletebtn" type="button" 
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(card.id);
          console.log("Deleting card:", id);
        }} >
          <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          viewBox="0 0 24 24"
          width="20"
          fill="currentColor"
          >
          <path d="M3 6h18v2H3zm2 3h14l-1 12H6L5 9zm3-5h8l1 2H7l1-2z"/>  
          </svg>
        </button>

        </div>
      ))}
      </div>
    </section>
    </div>
  
  );
}

export default App
