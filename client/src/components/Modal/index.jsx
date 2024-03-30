"use client";
import React, { useEffect, useState } from "react";
import modalStyles from "./modal.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Modal = ({ closeModal, id }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const authToken = localStorage.getItem("common-auth");
  const authTokenSuccess = (response) => {
    setAccessToken(response.accessToken);
    setUserId(response?.userID);
  };
  const updateUserWithAccessToken = async () => {
    try {
      const pageToken = await axios.get(
        `${process.env.NEXT_PUBLIC_FACEBOOK_GRAPH_API}/${userId}/accounts?access_token=${accessToken}`
      );
      const pageAccessToken = pageToken.data.data[0].access_token;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        { accessToken: pageAccessToken, id: id },
        {
          headers: {
            "common-auth": authToken,
          },
          withCredentials: true,
        }
      );
      toast.success("User updated successfully RE-DIRECTING!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(err?.response?.data?.message || "Error updating user", {
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

  useEffect(() => {
    if (userId && accessToken) {
      updateUserWithAccessToken();
    }
  }, [userId]);

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
              appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
              onProfileSuccess={(response) => {
                setUserId(response.id);
                console.log("Get Profile Success!", response);
              }}
              onSuccess={(response) => {
                authTokenSuccess(response);
              }}
              onFail={(error) => {
                console.log("Login Failed!", error);
              }}
              scope="read_page_mailboxes,pages_messaging"
            />
          </div>
        </div>
      </div>
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

export default Modal;
