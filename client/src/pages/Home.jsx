import { useState, useEffect } from 'react'
import "../index.css";
import { Link } from "react-router-dom";
import { Button, Input, AutoComplete, Tag, Alert} from "antd";
import { EditOutlined , DeleteOutlined, UserOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";

  import {
  FaBookOpen,
  FaLayerGroup,
  FaCheckCircle,
  FaRedoAlt
} from "react-icons/fa";

  import { Avatar, Space } from 'antd';
import { FaBolt } from 'react-icons/fa';



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
      const [showLoginDialog, setShowLoginDialog] = useState(false);

      const [filterDeck, setFilterDeck] = useState("All");
      const [searchQuery, setSearchQuery] = useState("");
    
      const [error, setError] = useState(null);
      const [loading, setLoading] = useState(true);

      const deckOptions = [
        { value: "General" },
        { value: "Biology" },
        { value: "History" },
        { value: "Maths" },
      ];
    
    useEffect(() => {
  Promise.all([
    fetch("http://localhost:5000/api/auth/me", { credentials: "include" }),
    fetch("http://localhost:5000/api/flashcards", { credentials: "include" })
  ])
    .then(async ([authRes, cardsRes]) => {
      // handle auth
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData?.user) setUser(authData.user);
      }

      // handle flashcards
      if (cardsRes.status === 401) {
        setFlashcards([]);
      } else if (cardsRes.ok) {
        const cardsData = await cardsRes.json();
        setFlashcards(Array.isArray(cardsData) ? cardsData : []);
      } else {
        throw new Error("Failed to fetch flashcards");
      }
    })
    .catch((err) => {
      console.error(err);
      setError(err.message);
    })
    .finally(() => {
      setLoading(false);
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
        setError("Logout failed, Please try again.");
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
      if (!user){
        setShowLoginDialog(true);
        return;
      }

      if (!question.trim() || !answer.trim()) {
        alert("Please fill in both the question and answer fields.");
        return;
      }
    
      const newFlashcard = {
        question: question.trim(),
        answer: answer.trim(),
        deck: deck.trim() || "General",
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
        setError("Failed to update flashcard");
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
            setError("Failed to create flashcard");
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
    
    
    
    if (loading) {
  return (
     <div className="app">
      <header className="app-header">
        <div className="logo">
          <FaBolt color="orange" size="2em" />
          <h1>Flash Learning</h1>
        </div>
      </header>
      <div className="status-page">
        <i className="ti ti-loader" aria-hidden="true" />
        <p>Loading flashcards...</p>
      </div>
    </div>
  );
}

if (error && flashcards.length === 0) {
  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <FaBolt color="orange" size="2em" />
          <h1>Flash Learning</h1>
        </div>
      </header>
      <div className="status-page status-page--error">
        <i className="ti ti-wifi-off" aria-hidden="true" />
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try again</button>
      </div>
    </div>
  );
}
    
    return (
      
    <div className = "app">
      {showLoginDialog && (
          <div className="dialog-overlay" onClick={() => setShowLoginDialog(false)}>
            <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-icon">
                <FaBolt color="orange" size="1.5em" />
                <i className="ti ti-lock" aria-hidden="true" />
              </div>
              <h3>Login / Register required</h3>
              <p>You need to have an account to create flashcards.</p>
              <div className="dialog-actions">
                <button className="dialog-btn-secondary" onClick={() => setShowLoginDialog(false)}>
                  Cancel
                </button>
                <Link to="/login" className="dialog-btn-primary">
                  Go to login
                </Link>
              </div>
            </div>
          </div>
        )}
      <header className="app-header">
        <div className="logo">
        <FaBolt color="orange" size="2em" />
        <h1>Flash Learning</h1>
        </div>
        <h2 className="header-message">Making studying Flashy! Exam prep has never been easier!</h2>
    <nav className="navbar">
      
    {!user ? (
    <>
    <Link to="/login">Login</Link>
    
    </>
        ) : (
    <>
    {user.role === "admin" && (
    <Link to="/admin-history">Learning History</Link>
    )}
    <Space size="large">   
    <Avatar class="navbar-avatar" style={{ backgroundColor: '#EF9F27', color: '#fff'}} icon={<UserOutlined />} />
    </Space>
    <Button className="logout-btn" onClick={handleLogout}>Logout</Button>
    </>
    )}
</nav>
    </header>

{/* stats section */}
      <div className="stats-grid">
    <div className="stat-card">
      <div className="stat-icon-box blue">
        <FaBookOpen />
      </div>
      <p className="stat-card__label">Total cards</p>
      <p className="stat-card__value">{flashcards.length}</p>
    </div>
    <div className="stat-card">
      <div className="stat-icon-box green">
        <FaLayerGroup />
      </div>
      <p className="stat-card__label">Decks</p>
      <p className="stat-card__value">
        {new Set(flashcards.map(c => c.deck || "General")).size}
      </p>
    </div>
    <div className="stat-card">
      <div className="stat-icon-box purple">
        <FaCheckCircle />
      </div>
      <p className="stat-card__label">Studied</p>
      <p className="stat-card__value">
        {hiddenCards.length}
      </p>
    </div>
    <div className="stat-card">
      <div className="stat-icon-box orange">
        <FaRedoAlt />
      </div>
      <p className="stat-card__label">Remaining</p>
      <p className="stat-card__value">
        {flashcards.length - hiddenCards.length}
      </p>
    </div>
  </div>
  
  {error && (
  <div className="error-banner">
    <i className="ti ti-alert-circle" aria-hidden="true" />
    <p>{error}</p>
    <button onClick={() => setError(null)}>✕</button>
  </div>
)}

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
        <div className="flashcard-header-top">
          <h2>My Flashcards</h2>
       
      <Input
        className="search-bar"
        placeholder="Search flashcards..."
        prefix={<SearchOutlined />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        allowClear
      />

      
      <Button className="ResetBtn" onClick={() => {
      setHiddenCards([]);
      setFlippedCards([]);
      setFadingCards([]);
      }}> Reset <ReloadOutlined />
      </Button>
      
      </div>
    
      <div className="deck-filter">
        {["All", ...new Set(flashcards.map(c => c.deck || "General"))].map(d => (
        <Button
          key={d}
          className={`filter-btn ${filterDeck === d ? "filter-btn--active" : ""}`}
          onClick={() => setFilterDeck(d)}
          >
          {d}
        </Button>
        
      ))}
      
    </div>
  </div>

      <div className="flashcard-grid">
     
      {(() => {
    
      const filtered = flashcards
      .filter((card) => !hiddenCards.includes(card._id))
      .filter((card) => filterDeck === "All" || (card.deck || "General") === filterDeck)
      .filter((card) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          card.question.toLowerCase().includes(q) ||
          card.answer.toLowerCase().includes(q) ||
          (card.deck || "General").toLowerCase().includes(q)
        );
      });
      
      
    if (filtered.length === 0) {
        return (
          <div className="empty-state">
            
            <i className="ti ti-cards" aria-hidden="true" />
            <p>
              {searchQuery.trim()
                ? `No flashcards found for "${searchQuery}"`
                : filterDeck !== "All"
                ? `No flashcards in "${filterDeck}"`
                : "No flashcards yet — create one above!"}
            </p>
          </div>
        );
      }
      return filtered.map((card)=> (
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
        <h2 className="tap-to-flip">Tap to Flip</h2>
        
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
      ))
})()}
      </div>
  </section>
  
  <footer className="app-footer">
  <p>© 2026 Flashcard App</p>
</footer>

</div>
  
    );
}

export default Home;