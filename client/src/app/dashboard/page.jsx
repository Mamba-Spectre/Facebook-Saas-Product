"use client";
import React, { use, useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";
import Google from "../../../assets/google.png";
import Group from "../../../assets/people.png";
import Clock from "../../../assets/clock.png";
import User from "../../../assets/user.png";
import EnvelopeIcon from "../../../assets/envelope (1).png";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import relativeTime from "dayjs/plugin/relativeTime"; // Import relativeTime plugin

dayjs.extend(relativeTime);

const Page = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("inbox");
  const [convo, setConvo] = useState(null);
  const [messages, setMessages] = useState(null);
  const [owner, setOwner] = useState(null);
  const [recieverID, setRecieverID] = useState(null);
  const [userName, setUserName] = useState(null);
  const [convoId, setConvoId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [selectedConvoIndex, setSelectedConvoIndex] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleUserClick = () => {
    setShowOptions(!showOptions);
  };

  const sendMessage = async (message) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/facebook/reply`,
        {
          recieverId: recieverID,
          message: message,
        },
        {
          withCredentials: true,
        }
      );
      if (response) {
        fetchMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      setMessageLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/facebook/messages`, {
        params: {
          conversationId: convoId,
        },
        withCredentials: true,
      });
      const filteredMessages = response.data.messages.filter(
        (message) => message.from.name !== owner
      );
      if (filteredMessages) {
        setRecieverID(filteredMessages[0].from.id);
      }
      setMessages(response.data.messages);
      setMessageLoading(false);
    } catch (error) {
      setMessageLoading(false);
    }
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem('common-auth');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/facebook/conversations`, 
      
      {
          headers: {
            'common-auth': `${authToken}`,
          },
        withCredentials: true,
      });
      setConvo(response.data.allConversationsFromDB);
      setOwner(response?.data?.allConversationsFromDB[0]?.pageName);
      setLoading(false);
    } catch (error) {
      if (error?.response?.status === 403) {
        router.push("/");
      }
      setLoading(false);
      console.error("Error fetching conversations:", error);
    }
  };


  const logut = () => {
    Cookies.remove("common-auth");
    router.push("/");
  };
  const logoutWithDisconnect = async () => {
    try {
      const authToken = localStorage.getItem('common-auth');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        headers: {
          "common-auth": authToken,
        },
        withCredentials: true,
      });
      if (response) {
        localStorage.removeItem("common-auth");
        Cookies.remove("common-auth");
        router.push("/");
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };
  useEffect(() => {
    if (convoId) {
      fetchMessages();
    }
  }, [convoId]);
  useEffect(() => {
    if (Cookies.get("common-auth") === undefined) {
      router.push("/");
    }
    fetchConversations();
  }, []);
  return (
    <>
      <div className="root">
        {loading ? (
          <div className="loader" />
        ) : (
          <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
            <div className="iconPanel">
              <div className="logo">
                <img src={Google.src} alt="Clock" className="icons" />
              </div>
              <div className="tabs">
                <div
                  className={`${selectedTab === "inbox" ? "active" : ""}`}
                  onClick={() => setSelectedTab("inbox")}
                >
                  <img src={EnvelopeIcon.src} alt="Inbox" className={`icons`} />
                </div>
                <div
                  className={`${selectedTab === "people" ? "active" : ""}`}
                  onClick={() => setSelectedTab("people")}
                >
                  <img src={Group.src} alt="People" className={`icons`} />
                </div>
              </div>
              <div className="user" onClick={handleUserClick}>
                <img src={User.src} alt="User" className={"icons"} />
                {showOptions && (
                  <div className="options">
                    <button onClick={() => logut()}>Logout</button>
                    <button onClick={() => logoutWithDisconnect()}>
                      Disconnect Page and Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="people">
              <h3
                style={{
                  textAlign: "center",
                  height: "32px",
                  marginTop: "6px",
                  padding: "12px 0px",
                }}
              >
                {owner}
              </h3>
              <h5
                className="nonHighlightedText"
                style={{ padding: "20px 10px 8px 8px" }}
              >
                Messages
              </h5>

              {convo && (
                <div className="peopleList">
                  {convo.map((item, index) => (
                    <div
                      key={index}
                      className={`convo ${
                        selectedConvoIndex === index ? "activeConvo" : "person"
                      }`}
                      onClick={() => {
                        setSelectedConvoIndex(index),
                          setConvoId(item?.conversationId),
                          setUserName(item?.senderName);
                      }}
                    >
                      <div className="nameTime">
                        <span className="userName">
                          {item?.senderName?.split(" ")[0]}{" "}
                          {item?.senderName?.split(" ")[1].charAt(0)}.
                        </span>
                        <span className="nonHighlightedText">
                          {dayjs().to(dayjs(item?.time)).replace(" ago", "")}
                        </span>
                      </div>
                      <div
                        style={{ marginTop: "8px" }}
                        className="nonHighlightedText"
                      >
                        {item.snippet}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="messenger">
              {messageLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                  }}
                >
                  <div className="loader" />
                </div>
              ) : (
                <>
                  {!messages ? (
                    <div className="noConversationText">
                      Select any conversation
                    </div>
                  ) : (
                    <>
                      <div className="conversations">
                        <img
                          src={Clock.src}
                          alt="Clock"
                          className="smallIcons"
                        />
                        <div className="personInfo">
                          <h3>{userName}</h3>
                        </div>
                      </div>
                      <div className="divider" />
                      <div className="messagesContianer">
                        {messages
                          ?.slice()
                          .reverse()
                          .map((conversation) => (
                            <div
                              key={conversation.id}
                              className={`messageContainer ${
                                owner === conversation.from.name
                                  ? "sentMessage"
                                  : "receivedMessage"
                              }`}
                            >
                              <div className="messageText">
                                {conversation.message}
                              </div>
                              <div className="timestamp">
                                {dayjs(conversation.created_time).format(
                                  "HH:mm (DD MMM)"
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                      <input
                        type="text"
                        className="input"
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            console.log("Enter pressed");
                            sendMessage(message);
                            setMessage("");
                          }
                        }}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
