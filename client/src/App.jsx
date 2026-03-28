import { useState, useEffect } from 'react'
import "./index.css";

function App() {
  const [count, setCount] = useState(0)
  
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  
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

  return (
    <div className = "app">
      <header className="app-header">
        <h1>Flashcard App</h1>
      </header>
    
    <section className="form-section">
      <h2>Create a Flashcard</h2>

      <form className="flashcard-form">
        <input type="text" placeholder="Question" />
        <input type="text" placeholder="Answer" />
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
        </div>
      ))}
      </div>
    </section>
    </div>
  
  );
}

export default App
