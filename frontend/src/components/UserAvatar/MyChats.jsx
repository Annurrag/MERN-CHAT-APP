import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { getSender } from "../../config/ChatLogics";
import { toast } from "react-toastify";

const MyChats = ({ searchActive, fetchAgain, onChatSelect }) => {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const [loggedUser, setLoggedUser] = useState(null);
  const { notification, setNotification } = ChatState();

  // fetch existing chats
  const fetchChats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast.error("Failed to load chats!");
      console.error("Error loading chats:", error.message);
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(userInfo);

    if (user && user.token) {
      fetchChats();
    }
  }, [user, fetchAgain]);

  // handle selecting a chat
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);

    // remove notifications of this chat
    setNotification((prev) => prev.filter((n) => n.chat._id !== chat._id));
  };

  // if search bar is active, hide MyChats
  if (searchActive) return null;
  if (!loggedUser || !chats) return null;

  return (
    <div className="flex-1 p-2 overflow-y-auto">
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => {
              handleSelectChat(chat);
              onChatSelect && onChatSelect(chat);
            }}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1
              ${
                selectedChat?._id === chat._id
                  ? "bg-indigo-300 border border-indigo-600"
                  : "hover:bg-gray-100"
              }`}
          >
            {/* Avatar */}
            <div className="relative">
              <RxAvatar className="h-12 w-12 text-indigo-500" />
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0 ">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-sm truncate gap-3 flex items-center">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}

                  {/*  Notification Badge */}
                  {notification?.filter((n) => n.chat?._id === chat._id)
                    ?.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {
                        notification?.filter((n) => n.chat?._id === chat._id)
                          ?.length
                      }
                    </span>
                  )}
                </h3>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm text-center mt-4">
          Search User To Chat
        </p>
      )}
    </div>
  );
};

export default MyChats;
