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
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
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
      <h1> Register </h1> {message && <p> {message} </p>}{" "}
      <form onSubmit={onSubmit}>
        <div>
          <label> Username </label>{" "}
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>{" "}
        <div>
          <label> Email Address </label>{" "}
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>{" "}
        <div>
          <label> Password </label>{" "}
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>{" "}
        <button type="submit"> Register </button>{" "}
      </form>{" "}
      <div>
        Already a member ? <a href="/login"> Login </a>{" "}
      </div>{" "}
    </div>
  );
};

export default Register;
