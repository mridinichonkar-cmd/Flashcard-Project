import { useState, useEffect } from 'react'
import "../index.css";
import { Link } from "react-router-dom";

function Login() {
    const [user, setUser] = useState(null);   
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    
    
    const handleRegister = async (e) => {
      e.preventDefault();
    
      try{
        const response = await fetch(
          "http://localhost:5000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              username,
              email,
              password,
            }),
          }
        );
    
        const data = await response.json();
    
        if (response.ok) {
          setUser(data.user);
          alert("Registered successfully");
          window.location.reload();
        } else {
          alert(data.message);
          }
        } catch(error){
            console.error(error);
      }
    };
    
    const handleLogin = async (e) => {
      e.preventDefault();
    
      try{
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials:"include",
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );
    
        const data = await response.json();
    
        if(response.ok){
          setUser(data.user);
          alert(data.message);
          window.location.reload();
    
        } else{
            alert(data.message);
          }
      } catch(error){
        console.error(error);
      }
    };
      
    return (

<div className="login-container">
    <header className="app-header">
        <h1>Flashcard App</h1>
        <nav className="navbar">
            <Link to="/">Home</Link>   
        </nav>
    </header>
    
    
    <h1>Login Page</h1>

     <form onSubmit={handleRegister}>     
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />

            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

        <button type="submit">Register</button>
        </form>

        <button onClick={handleLogin}>
            Login
        </button> 

    <footer className="app-footer">
  <p>© 2026 Flashcard App</p>
</footer>

</div>
    
    );
}

export default Login;