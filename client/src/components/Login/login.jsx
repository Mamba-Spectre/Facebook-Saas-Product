"use client";
import React, { useState } from "react";
import "./styles.css";
import axios from "axios";
import Modal from "../Modal";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const handleLoginSuccess = (sessionToken) => {
    Cookies.set("COMMON-AUTH", sessionToken);
    localStorage.setItem("sessionToken", sessionToken);
    setIsModalOpen(true);
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const authData = {
        email,
        password
      };
  
      const response = await axios.post("https://facebook-saas-product-production.up.railway.app/auth/login", authData);
      if (response?.data?.facebookAuthTokens) {
        Cookies.set("COMMON-AUTH", response?.data?.authentication?.sessionToken);
        router.push('/dashboard');
      } else {
        handleLoginSuccess(response.data.authentication.sessionToken);
      }
      console.log("response:", response.data);
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || "An error occurred");
    }
  };
  

  return (
    <div className="root">
      {loading ? (
        <div className="loader" />
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div>
            <label>Email:</label>
            <input
              type="email"
              required
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              required
              onChange={handlePasswordChange}
            />
          </div>
          {error && <p className="error">{error}</p>} {/* Render error message if error exists */}
          <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
        </form>
      )}
      {isModalOpen && (
        <Modal
          closeModal={() => {setIsModalOpen(false), setError("")}}
          handleSubmit={() => {
            console.log("submit");
          }}
        />
      )}
    </div>
  );
};

export default AuthForm;
