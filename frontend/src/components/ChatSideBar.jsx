import React, { useRef, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

import { RxAvatar } from "react-icons/rx";
import { FiSettings, FiUser, FiLogOut } from "react-icons/fi";
import axios from "axios";
import UserListItem from "./UserAvatar/UserListItem";
import { ChatState } from "../context/ChatProvider";
import MyChats from "./UserAvatar/MyChats";
import { toast } from "react-toastify";
import { api } from "../api";

const ChatSideBar = ({
  onChatSelect,
  onProfileClick,
  onCreateGroup,
  onLogout,
  fetchAgain,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [loading, setLoading] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loggedUser, setloggedUser] = useState();

  const dropDownRef = useRef(null);

  //from ChatState
  const { user, chats, setChats } = ChatState();

  // console.log("🧠 User from ChatState:", user);

  //fetch chats
  const fetchChats = async () => {
    if (!user || !user.token) {
      console.log("loading...");
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await api.get("/api/chat", config);
      setChats(data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching chats");
      console.error("Error fetching chats", error.message);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    //  re-fetch chats if a new one was created elsewhere
    fetchChats();
  }, [chats.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const accessChat = async (userId) => {
    console.log("access chat", userId);
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await api.post("/api/chat", { userId }, config);

      //Add new chats only if it's not already in list
      if (!chats.find((c) => c._id === data._id)) {
        setChats((prev) => [data, ...prev]);
      }
      // Select the opened chat
      // setSelectedChat(data);

      //clear search state after clicking user

      setSearchQuery("");
      setSearchResult([]);
      return data;
    } catch (error) {
      console.error("Error fetching the chats:", error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return null;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await api.get(`/api/user?search=${searchQuery}`, config);
      setSearchResult(data);
      setLoading(false);
      console.log(data);
    } catch (error) {
      toast.error("Error occurred while searching!");
      console.error("Error fetching search results:", error.message);
      setLoading(false);
    }
  };

  // Search Functionality runs automatically when user types
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      }
    }, 500); //debounce time
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-300 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Messages</h1>
          <div className="flex gap-2">
            <button
              onClick={onCreateGroup}
              className="h-10 w-10 flex items-center justify-center hover:bg-indigo-100 rounded-md"
            >
              <FaPlus className="text-indigo-600" />
            </button>

            <div className="relative" ref={dropDownRef}>
              <button
                onClick={() => setIsSettingsOpen((prev) => !prev)}
                className="h-10 w-10 flex items-center justify-center hover:bg-indigo-100 rounded-md"
              >
                <FiSettings className="text-indigo-600" />
              </button>

              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50">
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      // onProfileClick && onProfileClick();
                      onProfileClick();
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    <FiUser className="h-4 w-4" /> Profile
                  </button>
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      // onLogout && onLogout();
                      onLogout();
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    <FiLogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <IoIosSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {searchQuery && searchResult.length > 0 ? (
            <>
              {searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={async () => {
                    const chat = await accessChat(user._id);
                    onChatSelect(chat);
                  }}
                />
              ))}
            </>
          ) : (
            <MyChats fetchAgain={fetchAgain} onChatSelect={onChatSelect} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;
