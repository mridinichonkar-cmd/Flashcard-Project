import { useState, useEffect } from 'react'
import "./index.css";
import { FaTrash, FaEdit } from "react-icons/fa";


function App() {
  
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editId, setEditId]= useState(null);

  
  useEffect(() => {
    fetch("http://localhost:5000/api/flashcards")
    .then((response) => response.json())
    .then ((data) => {setFlashcards(data);
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

  if(editId){

    try{
    const response = await fetch(`http://localhost:5000/api/flashcards/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFlashcard),
    });

      const savedUpdatedCard = await response.json();
      setFlashcards((prevFlashcards) => prevFlashcards.map((card) => (card._id === editId ? savedUpdatedCard : card)));
      setQuestion("");
      setAnswer("");
      setEditId(null);

  } catch (error) {
    console.error("Error updating flashcard:", error);
  }
    
  }else{
    try {
      const response = await fetch("http://localhost:5000/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFlashcard),
      });

      const savedCard = await response.json();
      setFlashcards((prevFlashcards) => [...prevFlashcards, savedCard]);
      setQuestion("");
      setAnswer("");
    
    } catch (error) {
        console.error("Error creating flashcard:", error);
    }
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

    setFlashcards((prevFlashcards) => prevFlashcards.filter((card) => card._id !== id));
      
  } catch (error) {
    console.error("Error deleting flashcard:", error);
  }
};

const handleEdit = (card) =>{
  setQuestion(card.question);
  setAnswer(card.answer);
  setEditId(card._id);
}

  return (
    <div className = "app">
      <header className="app-header">
        <h1>Flashcard App</h1>

        <nav className="navbar">
        <a href="#home">Home</a>
        <a href="#services">Services</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
          
        </nav>
      </header>
    
    <section className="form-section">
      <h2>Create a Flashcard</h2>

      <form className="flashcard-form" onSubmit={handleFormSubmit}>
        <input id="question" type="text" placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <input id="answer" type="text" placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <button type="submit">{editId ? "Update Flashcard" : "Add Flashcard"}</button>
      </form>
    </section>


    <section className="flashcard-section">
      <h2>My Flashcards</h2>
      
      <div className="flashcard-grid">
      
      
      {flashcards.map((card)=> (
        <div 
        className="flashcard"
        key={card._id}
        onClick={() => handleCardFlip(card._id)}
        >
        
        <div
        className={`flashcard-inside ${flippedCards.includes(card._id) ? "flipped" : ""}`}
        > 

        <div className="flashcard-front">
        <div className="flashcard-content">
        <h2>{card.question}</h2>
        </div>
       

        <div className="button-container">
        
        <button title= "Edit" className="editbtn" type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(card);
        }}
          >
          <FaEdit />
          </button>
        

        <button title= "Delete" className= "deletebtn" type="button" 
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(card._id);
          console.log("Deleting card:", card._id);
        }} >
          <FaTrash />
        </button>
      </div>
      </div>

      <div className="flashcard-back">
        <div className="flashcard-content">
  
          <h3>{card.answer}</h3>
        </div>
      </div>

    </div>
  </div>
))}
  
  </div>
  </section>
  
  <footer className="app-footer">
  <p>© 2026 Flashcard App</p>
</footer>

</div>
  
  );
}

export default App
