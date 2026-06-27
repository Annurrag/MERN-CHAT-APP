import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { getSender } from "../../config/ChatLogics";
import { toast } from "react-toastify";
import { api } from "../../api";

const MyChats = ({ searchActive, fetchAgain, onChatSelect }) => {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const [loggedUser, setLoggedUser] = useState(null);
  const { notification, setNotification } = ChatState();

  // Helper function to get two-letter initials from a name
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name[0] + name[1] || name[0]).toUpperCase();
  };

  // fetch existing chats
  const fetchChats = async () => {
    if (!user || !user.token) {
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await api.get("/api/chat", config);
      setChats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading chats:", error.message);
      setChats([]);
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
        chats.map((chat) => {
          let avatarContent;
          let otherUserName = !chat.isGroupChat
            ? getSender(loggedUser, chat.users)
            : chat.chatName;
          let otherUser = !chat.isGroupChat
            ? chat.users.find((u) => u._id !== loggedUser._id)
            : null;

          if (!chat.isGroupChat && otherUser?.pic) {
            // Show uploaded profile picture for 1-on-1 chats
            avatarContent = (
              <img
                src={otherUser.pic}
                alt={otherUserName}
                className="h-11 w-11 rounded-full object-cover border-2 border-white"
              />
            );
          } else {
            // Show two-letter initials
            avatarContent = (
              <div className="h-11 w-11 rounded-full bg-[#d8b78b] flex items-center justify-center text-white text-sm font-semibold border-2 border-white">
                {getInitials(otherUserName)}
              </div>
            );
          }

          return (
            <div
              key={chat._id}
              onClick={() => {
                handleSelectChat(chat);
                onChatSelect && onChatSelect(chat);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 mb-2 border
                ${
                  selectedChat?._id === chat._id
                    ? "bg-[#f3e4d3] border-[#d8b78b] shadow-sm"
                    : "bg-white border-[#eadfce] hover:bg-[#f9f2e8]"
                }`}
            >
              <div className="relative">
                {avatarContent}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-medium text-sm truncate">
                    {otherUserName}
                  </h3>

                  {notification?.filter((n) => n.chat?._id === chat._id)
                    ?.length > 0 && (
                    <span className="bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full shrink-0">
                      {
                        notification?.filter((n) => n.chat?._id === chat._id)
                          ?.length
                      }
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 truncate">
                  {chat.latestMessage?.content
                    ? chat.latestMessage.content.length > 35
                      ? `${chat.latestMessage.content.slice(0, 35)}...`
                      : chat.latestMessage.content
                    : "Start a conversation"}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-sm text-center mt-4">
          Search User To Chat
        </p>
      )}
    </div>
  );
};

export default MyChats;
