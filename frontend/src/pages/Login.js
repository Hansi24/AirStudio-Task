import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log('Response:', res.data.token); 
      localStorage.setItem("token", res.data.token)
      setMessage(res.data.msg); 
      navigate('/home'); 
    } catch (err) {
      console.error('Error:', err);
      if (err.response && err.response.data) {
        setMessage(err.response.data.msg); 
      } else {
        setMessage('An error occurred');
      }
    }
  };

  return (
    <div className="log-container">
      <h1>Login</h1>
      {message && <p>{message}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            value={email} 
            onChange={onChange} 
            required 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            value={password} 
            onChange={onChange} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
        Don't have an account ? <a href="/"> Sign Up </a>{" "}
      </div>{" "}
    </div>
  );
};

export default Login;
