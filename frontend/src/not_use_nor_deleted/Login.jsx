import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccesMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        formData,
      );
      console.log("Success!", response.data);
      setSuccesMessage("Login Successfull!");
      localStorage.setItem("accessToken", response.data.tokens.access);
      localStorage.setItem("refreshToken", response.data.tokens.refresh);
      navigate("/dashboard");
    } catch (error) {
      console.log("Error during Login!", error.response?.data);
      if (error.response && error.response.data) {
        Object.keys(error.response.data).forEach((field) => {
          const errorMessages = error.response.data[field];
          if (errorMessages && errorMessages.length > 0) {
            setError(errorMessages[0]);
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "Green" }}>{successMessage}</p>}
      <h2>Login:</h2>
      <form>
        <label>email:</label>
        <br />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        ></input>{" "}
        <br />
        <br />
        <label>password:</label> <br />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        ></input>
        <br />
        <br />
        <button type="submit" disabled={isLoading} onClick={handleSubmit}>
          {" "}
          Login
        </button>
      </form>
    </div>
  );
}
