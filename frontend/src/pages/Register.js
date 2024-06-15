import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const validateForm = () => {
    if (!username || !email || !password) {
      setMessage("All fields are required");
      return false;
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email address");
      return false;
    }

    // Validate password format using regex
    const passwordRegex =
      /^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[!@#$%^&()_+])(?=.[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return false;
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Exit early if validation fails
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });
      if (res && res.data && res.data.msg) {
        setMessage(res.data.msg);
        navigate("/login");
      } else {
        setMessage("Unknown error occurred");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setMessage(err.response.data.msg);
      } else {
        setMessage("An error occurred");
      }
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>
      {message && <p>{message}</p>}
      <h4>Create Your account</h4>
      <form onSubmit={onSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Email Address"
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
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <div class="mt-3">
        Already a member? <a href="/login">Login</a>
      </div>
    </div>
  );
};

export default Register;