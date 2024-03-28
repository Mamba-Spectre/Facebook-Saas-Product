"use client";
import React, { useEffect, useState } from "react";
import modalStyles from "./modal.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import {useRouter} from 'next/navigation'
import FacebookLogin from "@greatsumini/react-facebook-login";

const Modal = ({ closeModal, handleSubmit }) => {
  const [accessToken, setAccessToken] = useState(null);
  const sessionToken = Cookies.get("COMMON-AUTH");
  const router = useRouter()
  const authTokenSuccess = (response) => { 
    console.log("Login Success!", response);
    setAccessToken(response.accessToken);
    updateUserWithAccessToken(response.accessToken);
  };

  const updateUserWithAccessToken = async (accessToken) => {
    try {
      const pageToken = await axios.get(`https://graph.facebook.com/3690963331186478/accounts?access_token=${accessToken}`)
      const pageAccessToken = pageToken.data.data[0].access_token
      console.log("Page Token", pageToken.data.data[0].access_token)
      const response = await axios.post(
        `http://localhost:8080/users/6601d13bd004eb8037b40ed6`,
        { accessToken:pageAccessToken,id:"6601d13bd004eb8037b40ed6" },
        {
          withCredentials: true
        }
      );
      router.push('/dashboard')
      console.log("User updated successfully:", response.data);
      // Optionally, you can show a success message or perform other actions here
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user", { autoClose: 2000 });
    }
  };

  // useEffect(() => {
  //   fetchMovies();
  // }, []);

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modal}>
        <button className={modalStyles.closeButton} onClick={closeModal}>
          X
        </button>
        <h2 className={modalStyles.h21}>Connect Your Facebook Page</h2>
        <div className={modalStyles.facebookConnectPage}>
        <div className={modalStyles.facebookLoginWrapper}>
          <FacebookLogin
            appId="865125058698046"
            onSuccess={(response) => {
              authTokenSuccess(response);
            }}
            onFail={(error) => {
              console.log("Login Failed!", error);
            }}
            onProfileSuccess={(response) => {
              console.log("Get Profile Success!", response);
            }}
            scope="read_page_mailboxes,pages_messaging"
          />
        </div>

        </div>
      </div>
    </div>
  );
};

export default Modal;
