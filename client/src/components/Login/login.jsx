"use client";
import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";
import Modal from "../Modal";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const handleLoginSuccess = (sessionToken) => {
    Cookies.set("common-auth", sessionToken, { path: "/" });
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
        password,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        authData
      );
      if (response?.data?.facebookAuthTokens) {
        Cookies.set(
          "common-auth",
          response?.data?.authentication?.sessionToken,
          { path: "/" }
        );
        localStorage.setItem(
          "common-auth",
          response?.data?.authentication?.sessionToken
        );
        router.push("/dashboard");
      } else {
        setUserId(response?.data?._id);
        handleLoginSuccess(response.data.authentication.sessionToken);
      }
      console.log("response:", response.data);
    } catch (err) {
      setLoading(false);
      toast.error(err?.response?.data?.message || "An error occurred", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <div className="root">
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
          {
            loading? <Loader/> : <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
          }
        </form>

      {isModalOpen && (
        <Modal
          closeModal={() => {
            setLoading(false),
            setIsModalOpen(false);
          }}
          id={userId}
        />
      )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default AuthForm;
