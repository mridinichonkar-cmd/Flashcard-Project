import { useState, useEffect } from 'react'
import "../index.css";
import { Link } from "react-router-dom";

import { Button, Input, Form } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { FaBolt } from "react-icons/fa";

function Login() {
  
    const [loginLoading, setLoginLoading] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    
    const handleRegister = async ({username, email, password}) => {
      setRegisterLoading(true);
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
          // setUser(data.user);
          alert("Registered successfully, you can now log in!");
          
        } else {
          alert(data.message);
          }
        } catch(error){
            console.error(error);
      } finally {
        setRegisterLoading(false);
      }
    };
    
    const handleLogin = async ({email, password}) => {
      setLoginLoading(true);
    
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
            alert(data.message);
          }
      } catch(error){
        console.error(error);
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