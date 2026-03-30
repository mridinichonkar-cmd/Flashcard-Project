import { useState, useEffect } from 'react'

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

  return (
    <div className = "app">
      <header className="app-header">
        <h1>Flashcard App</h1>
      </header>
      
      <section className="form-section">
      <form className="flashcard-form" onSubmit={handleFormSubmit}>
        <input type="text" placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <input type="text" placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <button type="submit">Add Flashcard</button>
      </form>
    </section>

    <section className="flashcard-section">
      <h2>My Flashcards</h2>
    </section>

      {flashcards.map((card)=> (
        <div 
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
  
  );
}

export default App
