import { useState, useEffect } from 'react'
import "../index.css";
import { Link } from "react-router-dom";

import { Button, Input, Form } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { FaBolt } from "react-icons/fa";

function Login() {
  
    const [loginLoading, setLoginLoading] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);       // ← add
    const [registerError, setRegisterError] = useState(null); // ← add
    const [registerSuccess, setRegisterSuccess] = useState(false); // ← add

    
    const handleRegister = async ({username, email, password}) => {
      setRegisterLoading(true);
      setRegisterError(null); // ← reset error
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
              password }),
          });

    
        const data = await response.json();
    
        if (response.ok) {

          setRegisterSuccess(true);
          
          
        } else {
          setRegisterError(data.message || "Registration failed"); // ← set error message
          }
        } catch(error){
            console.error(error);
            setRegisterError("An error occurred during registration"); // ← set generic error
      } finally {
        setRegisterLoading(false);
      }
    };
    
    const handleLogin = async ({email, password}) => {
      setLoginLoading(true);
      setLoginError(null); // ← reset error
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

          setLoginLoading(false);
          window.location.href = "/";

        } else{
            setLoginError(data.message || "Login failed"); // ← set error message
          }
      } catch(error){
        console.error(error);
        setLoginError("An error occurred during login"); // ← set generic error
      } finally{
         setLoginLoading(false);
      }
    };
      
    return (

<div className="auth-page">
    <header className="app-header">
        <h1>Flashcard App</h1>
        <nav className="navbar">
            <Link to="/">Home</Link>   
        </nav>
    </header>
    
    <div className="auth-forms-row">

        {/* Login card */}
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <FaBolt style={{ color: "var(--orange-400)", fontSize: 22 }} />
              <i className="ti ti-cards" style={{ color: "var(--orange-400)", fontSize: 22 }} />
            </div>
            <h2>Welcome back</h2>
            <p>Log in to your account</p>
          </div>

          <Form layout="vertical" onFinish={handleLogin} className="auth-form">
            <Form.Item label="Email" name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" }
              ]}>
              <Input prefix={<MailOutlined />} placeholder="you@example.com" size="large" />
            </Form.Item>

            <Form.Item label="Password" name="password"
              rules={[{ required: true, message: "Please enter your password" }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
            </Form.Item>

            <Button htmlType="submit" loading={loginLoading} className="auth-btn" block>
              Log in
            </Button>
            {loginError && (
              <div className="auth-error">
                <i className="ti ti-alert-triangle" aria-hidden="true" />
                <p>{loginError}</p>
              </div>
            )}

          </Form>
        </div>

        {/* Divider */}
        <div className="auth-divider">
          <span>or</span>
        </div>

        {/* Register card */}
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <FaBolt style={{ color: "var(--orange-400)", fontSize: 22 }} />
              <i className="ti ti-user-plus" style={{ color: "var(--orange-400)", fontSize: 22 }} />
            </div>
            <h2>Create an account</h2>
            <p>Start learning with flashcards</p>
          </div>


          {registerError && (
            <div className="auth-error">
              <i className="ti ti-alert-triangle" aria-hidden="true" />
              <p>{registerError}</p>
            </div>
          )}
          {registerSuccess && (
            <div className="auth-success">
              <i className="ti ti-check" aria-hidden="true" />
              <p>Account created successfully!</p>
            </div>
          )}

          <Form layout="vertical" onFinish={handleRegister} className="auth-form">
            <Form.Item label="Username" name="username"
              rules={[{ required: true, message: "Please enter a username" }]}>
              <Input prefix={<UserOutlined />} placeholder="johndoe" size="large" />
            </Form.Item>

            <Form.Item label="Email" name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" }
              ]}>
              <Input prefix={<MailOutlined />} placeholder="you@example.com" size="large" />
            </Form.Item>

            <Form.Item label="Password" name="password"
              rules={[
                { required: true, message: "Please enter a password" },
                { min: 6, message: "Password must be at least 6 characters" }
              ]}>
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
            </Form.Item>

            <Button htmlType="submit" loading={registerLoading} className="auth-btn" block>
              Create account
            </Button>
            
          </Form>
        </div>

      </div>  {/* ← closes auth-forms-row */}


    <footer className="app-footer">
        <p>© 2026 Flashcard App</p>
    </footer>

</div>
    );
}

export default Login;