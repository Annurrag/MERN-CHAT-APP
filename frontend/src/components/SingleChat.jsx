import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { IoArrowBackCircle } from "react-icons/io5";
import { getSender } from "../config/ChatLogics";
import { RxAvatar } from "react-icons/rx";
import { TiGroup } from "react-icons/ti";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { config } from "dotenv";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "lottie-react";
import animationData from "../animations/typing.json";
import { api, SOCKET_URL } from "../api";

const ENDPOINT = SOCKET_URL;
// const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [isUpdateGroupModalOpen, setIsUpdateGroupModalOpen] = useState(false);

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
  };

  //fetch all messages for selected chat
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await api.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log("Fteched message", messages);

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Failed to Load the messages" + error, {
        position: "bottom-left",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      // console.log("Sending message:", newMessage);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await api.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        console.log(data);
        setMessages([...messages, data]);

        socket.emit("new message", data);
      } catch (error) {
        toast.error("Failed to send the message" + error, {
          position: "bottom-left",
        });
      }
    }
  };

  useEffect(() => {
    if (!user) return;

    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      console.log("Socket connected");
      setSocketConnected(true);
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    //prevents duplicate connections
    return () => {
      socket.disconnect();
    };
  }, [user]);

  //fetch messages when selected chat changes
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // console.log(notification, "--------");

  useEffect(() => {
    if (!socket) return;

    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        setNotification((prev) => {
          const exists = prev.some(
            (n) => n.chat._id === newMessageRecieved.chat._id
          );
          if (!exists) return [newMessageRecieved, ...prev];
          return prev;
        });

        setFetchAgain((prev) => !prev); // refresh chat list
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });

    //cleanup to prevent multiple listeners
    return () => {
      socket.off("message recieved");
    };
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing indicator logic
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col h-screen w-full bg-[#F7F8FA] ">
          {/* Header */}
          <div className="flex items-center justify-between w-full px-4 py-3 border-b border-gray-200 bg-gray-150">
            {/* Back Button (mobile only) */}
            <button
              onClick={() => setSelectedChat("")}
              className="md:hidden p-2 rounded-full hover:bg-gray-200 transition"
            >
              <IoArrowBackCircle
                onClick={onBack}
                className="w-6 h-6 text-gray-700"
              />
            </button>

            {/* Chat Info */}
            <div className="flex items-center gap-3 flex-1">
              {!selectedChat.isGroupChat ? (
                <>
                  <RxAvatar className="h-10 w-10 text-gray-700" />
                </>
              ) : (
                <>
                  <TiGroup className="h-10 w-10 text-gray-700" />
                </>
              )}

              <h2 className="text-xl font-semibold text-gray-800 font-[Work Sans]">
                {!selectedChat.isGroupChat ? (
                  getSender(user, selectedChat.users).toUpperCase()
                ) : (
                  <>{selectedChat.chatName.toUpperCase()}</>
                )}
              </h2>
            </div>
            {selectedChat.isGroupChat && (
              <button
                onClick={() => setIsUpdateGroupModalOpen(true)}
                className="px-4 py-2 bg-indigo-300 text-white rounded-md hover:bg-indigo-700"
              >
                <FaEdit className="w-5 h-5 text-gray-700 " />
              </button>
            )}
          </div>

          {/* Messages Area */}

          {loading ? (
            <>Loading...</>
          ) : (
            <>
              {/* <div className="flex-1 overflow-y-auto px-4 pt-4 pb-0 bg-[#F7F8FA]"> */}

              <div className="flex-1 overflow-y-auto px-4 py-2 bg-[#F7F8FA]">
                <ScrollableChat messages={messages} />
              </div>
            </>
          )}

          {/* Input Area */}
          <div
            // className=" border-t border-gray-200 bg-[#F7F8FA] px-3 py-2"
            className="p-3 border-t border-gray-200 bg-[#F7F8FA]"
            isrequired="true"
          >
            {isTyping ? (
              <div className="w-16">
                <Lottie animationData={animationData} loop autoplay />
              </div>
            ) : (
              <></>
            )}
            <input
              type="text"
              placeholder="Type a message..."
              onChange={typingHandler}
              value={newMessage}
              onKeyDown={sendMessage}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/*  Update Group Modal */}
          {isUpdateGroupModalOpen && ( //  modal only renders when open
            <UpdateGroupChatModal
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              fetchMessages={fetchMessages}
              isOpen={isUpdateGroupModalOpen}
              onClose={() => setIsUpdateGroupModalOpen(false)} //  closes modal
            />
          )}
        </div>
      ) : (
        // Default View when no chat is selected
        <div className="flex items-center justify-center h-full text-center">
          <p className="text-2xl text-gray-400 font-[Work Sans] px-4">
            Click on a user to start chatting
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
