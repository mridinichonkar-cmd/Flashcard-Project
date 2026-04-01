import { useState, useEffect } from 'react'
import "./index.css";
import { FaTrash, FaEdit } from "react-icons/fa";


function App() {
  const [count, setCount] = useState(0)
  
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editId, setEditId]= useState(null);

  
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

  if(editId){

    try{
    const response = await fetch(`http://localhost:5000/api/flashcards/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFlashcard),
    });

      const data = await response.json();
      setFlashcards((prevFlashcards) => prevFlashcards.map((card) => (card.id === editId ? data : card)));
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

      const data = await response.json();
      setFlashcards((prevFlashcards) => [...prevFlashcards, data]);
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

    setFlashcards((prevFlashcards) => prevFlashcards.filter((card) => card.id !== id));
      
  } catch (error) {
    console.error("Error deleting flashcard:", error);
  }
};

const handleEdit = (card) =>{
  setQuestion(card.question);
  setAnswer(card.answer);
  setEditId(card.id);
}

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
        <button type="submit">{editId ? "Update Flashcard" : "Add Flashcard"}</button>
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
          handleDelete(card.id);
          console.log("Deleting card:", id);
        }} >
          <FaTrash />
        </button>
      </div>
        </div>
      ))}
      </div>
    </section>
    </div>
  
  );
}

export default App
