import { useState, useEffect } from 'react'
import "../index.css";
import { Link } from "react-router-dom";
import { Button, Input, AutoComplete, Tag} from "antd";
import { EditOutlined , DeleteOutlined, UserOutlined} from "@ant-design/icons";
import { Avatar, Space } from 'antd';



function Home(){
     
      const [flashcards, setFlashcards] = useState([]);
    
      //tracing flipped flashcards
      const [flippedCards, setFlippedCards] = useState([]);
    
      //input form
      const [question, setQuestion] = useState("");
      const [answer, setAnswer] = useState("");
      const [deck, setDeck] = useState("");
    
      //storing card being edited
      const [editId, setEditId]= useState(null);
    
      //hidden cards and fading state
      const [hiddenCards, setHiddenCards] = useState([]);
      const [fadingCards, setFadingCards] = useState([]);
    
      const [user, setUser] = useState(null);
    

      const deckOptions = [
        { value: "General" },
        { value: "Biology" },
        { value: "History" },
        { value: "Maths" },
      ];
    
    useEffect(() => {
        fetch("http://localhost:5000/api/auth/me", {
        credentials: "include",
        })
        .then((res) => {
        if (!res.ok) return null;
            return res.json();
        })
        .then((data) => {
        if (data?.user) {
            setUser(data.user);
        }
        })
        .catch((err) => console.error(err));
    }, []);

      //fetching flashcards after loading
    useEffect(() => {
      fetch("http://localhost:5000/api/flashcards", {
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            return [];
          }
    
          return response.json();
        })
        .then((data) => {
          setFlashcards(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.error("Error fetching flashcards:", error);
          setFlashcards([]);
        });
    }, []);
       
    
    
    const handleLogout = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/logout",
          {
            method: "POST",
            credentials: "include",
          }
        );
    
        if (response.ok) {
          setUser(null);
          window.location.reload();
        }
    
      } catch (error) {
        console.error(error);
      }
    };
    
    
    
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
        deck: deck.trim(),
      };
      //if editing then update card
      if(editId){
    
        try{
        const response = await fetch(`http://localhost:5000/api/flashcards/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials:"include",
          body: JSON.stringify(newFlashcard),
        });
    
          const savedUpdatedCard = await response.json();
          //replace updated card in state
          setFlashcards((prevFlashcards) => prevFlashcards.map((card) => (card._id === editId ? savedUpdatedCard : card)));
          setQuestion("");
          setAnswer("");
          setDeck("General");
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
            credentials:"include",
            body: JSON.stringify(newFlashcard),
          });
    
          const savedCard = await response.json();
          setFlashcards((prevFlashcards) => [...prevFlashcards, savedCard]);
          setQuestion("");
          setAnswer("");
          setDeck("General");
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
          credentials:"include",
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
      setDeck(card.deck || "General");
      setEditId(card._id);
    }
    
    console.log(flashcards);
    
    
    return (

    <div className = "app">
      <header className="app-header">
        
        <h1>Flash Learning</h1>

    <nav className="navbar">
    {!user ? (
    <>
    <Link to="/login">Login</Link>
    <Link to="/login">Register</Link>
    </>
        ) : (
    <>
    {user.role === "admin" && (
    <Link to="/admin-history">Admin History</Link>
    )}
    <Space size="large">   
    <Avatar class="navbar-avatar" style={{ backgroundColor: '#EF9F27', color: '#fff'}} icon={<UserOutlined />} />
    </Space>
    <Button type="primary" onClick={handleLogout}>Logout</Button>
    </>
    )}
</nav>
    </header>

    
  {/* //form section for card creation */}
    <section className="form-section">
      <h2>Create a Flashcard</h2>

      <form className="flashcard-form" onSubmit={handleFormSubmit}>
        <div className="form-field">
        <label htmlFor="question" className="form-label">Question</label>
        <Input
          id="question"
          type="text"
          placeholder="What is photosynthesis?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        </div>
          <div className="form-field">
          <label htmlFor="answer" className="form-label">Answer</label>
        <Input
          id="answer"
          type="text"
          placeholder="Enter the answer here"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        </div>
        <div className="form-field">
          <label htmlFor="deck" className="form-label">Deck</label>
        <AutoComplete
          id="deck"
          className="form-select"
          placeholder="Select or type a deck"
          value={deck}
          options={deckOptions}
          onChange={(value) => setDeck(value)}
          filterOption={(input, option) =>
            option?.value?.toLowerCase().includes(input.toLowerCase())
          }
          style={{ width: "100%" }}
          />
        </div>
        <Button htmlType="submit" className="btn-primary">{editId ? "Update Flashcard" : " + Add Flashcard"}</Button>
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
          <Tag className="deck-label">{card.deck || "General"}</Tag>
        <div className="flashcard-content">
        <h2>{card.question}</h2>
        </div>
       

        <div className="button-container">
        
        <Button shape="circle" title= "Edit" className="editbtn" type="button"
          onClick={(e) => {
          e.stopPropagation();
          handleEdit(card);
        }}
          >
          <EditOutlined />
          </Button>
        

        <Button title= "Delete" shape='circle' className= "deletebtn" type="button" 
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(card._id);
          console.log("Deleting card:", card._id);
        }} >
          <DeleteOutlined />
        </Button>
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

export default Home;