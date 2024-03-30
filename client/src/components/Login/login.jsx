"use client";
import React, { useState } from "react";
import "./styles.css";
import axios from "axios";
import Modal from "../Modal";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import cookieClient from 'react-cookie'
const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [userId,setUserId] = useState("");
  const router = useRouter();
  const handleLoginSuccess = (sessionToken) => {
    // cookieClient.save('common-auth', sessionToken, {path:'/'})
    Cookies.set("common-auth", sessionToken, {path:'/'});
    localStorage.setItem("common-auth", sessionToken);
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
      const response = await axios.post(`http://localhost:8080/auth/login`, authData);
      if (response?.data?.facebookAuthTokens) {
        // document.cookie = "common-auth=" + encodeURIComponent(sessionToken) + "; path=/";
        // cokkieClient.save('common-auth', response?.data?.facebookAuthTokens?.sessionToken, {path:'/'})
        Cookies.set("common-auth", response?.data?.authentication?.sessionToken, {path:'/'});
        localStorage.setItem("common-auth", response?.data?.authentication?.sessionToken);
        router.push('/dashboard');
      } else {
        setUserId(response?.data?._id);
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
          id={userId}
        />
      )}
    </div>
  );
};

export default AuthForm;
