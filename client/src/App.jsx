import { useState, useEffect } from 'react'
import "./index.css";
import { FaTrash, FaEdit } from "react-icons/fa";


function App() {
  
  const [flashcards, setFlashcards] = useState([]);

  //tracing flipped flashcards
  const [flippedCards, setFlippedCards] = useState([]);

  //input form
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  //storing card being edited
  const [editId, setEditId]= useState(null);

  //hidden cards and fading state
  const [hiddenCards, setHiddenCards] = useState([]);
  const [fadingCards, setFadingCards] = useState([]);


  //fetching flashcards after loading
  useEffect(() => {
    fetch("http://localhost:5000/api/flashcards")
    .then((response) => response.json())
    .then ((data) => {setFlashcards(data);
    })
    .catch((error) => {
      console.error("Error fetching flashcards:", error);
    });

  }, []);
   

//flipping cards
const handleCardFlip = (id) => {
  if (!flippedCards.includes(id)) {
    setFlippedCards((prev) => [...prev, id]); //first click to show answer
  } else {
    //second click to flip to question
    setFlippedCards((prev) => prev.filter((cardId) => cardId !== id)); 
    //after flip start fade
    setTimeout(() => {
      setFadingCards((prev) => [...prev, id]);
       setTimeout(() => {
      setHiddenCards((prev) => [...prev, id]);
      setFadingCards((prev) => prev.filter((cardId) => cardId !== id));
    }, 400); 
    }, 700)
    
  }
};

// hello world

//handles creating and update
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
  //if editing then update card
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
      //replace updated card in state
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

//delete flashcard from database
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
      {/* //header section */}
      <header className="app-header">
        <h1>Flashcard App</h1>

        <nav className="navbar">
        <a href="#home">Home</a>
        <a href="#services">Services</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
          
        </nav>
      </header>
    
  {/* //form section for card creation */}
    <section className="form-section">
      <h2>Create a Flashcard</h2>

      <form className="flashcard-form" onSubmit={handleFormSubmit}>
        <input id="question" type="text" placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <input id="answer" type="text" placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <button type="submit">{editId ? "Update Flashcard" : "Add Flashcard"}</button>
      </form>
    </section>


    <section className="flashcard-section">

      <div className="flashcard-header">
      <h2>My Flashcards</h2>
      <button className="ResetBtn" onClick={() => {
      setHiddenCards([]);
      setFlippedCards([]);
      setFadingCards([]);
      }}> Reset Flashcards
      </button>
      </div>


      <div className="flashcard-grid">
    
      {flashcards
      .filter((card) => !hiddenCards.includes(card._id))
      .map((card)=> (
        <div 
        className={`flashcard ${fadingCards.includes(card._id) ? "fade-out" : ""}`}
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
