import React, { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { FaCheck, FaUsers } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import { ChatState } from "../context/ChatProvider";
import UserListItem from "./UserAvatar/UserListItem";
import { config } from "dotenv";
import { api } from "../api";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) return;

    if (!user || !user.token) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }
    //logic to fetch search users
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await api.get(`/api/user?search=${query}`, config);
      console.log(data);

      setSearchResult(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred!");
    } finally {
      setLoading(false);
    }
  };

  const handleUsersToggle = (user) => {
    const alreadyAdded = selectedUsers.find((u) => u._id === user._id);
    if (alreadyAdded) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
      return;
    }

    setSelectedUsers([...selectedUsers, user]);
  };

  const handleRemoveUser = (id) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== id));
  };

  // Logic to create group
  const handleCreateGroup = async () => {
    if (!groupName || !selectedUsers) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await api.post(
        "/api/chat/group",
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast.success("Group created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      {/* Overlay  */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      {/* Modal Box  */}
      <div className="relative bg-white rounded-2xl shadow-lg max-w-lg w-full mx-4 max-h-[90vh] flex flex-col">
        {/* header  */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Create New Group</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <MdOutlineCancel className="h-5 w-5" />
          </button>
        </div>
        {/* Content  */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          {/* Group Info  */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-indigo-500 rounded-2xl flex items-center justify-center ">
                <FaUsers className="h-8 w-8" />
              </div>
              <div className="flex-1 space-y-2">
                <label htmlFor="" className="block text-sm font-medium">
                  Group Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Group Name..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            {/* selected Users  */}
            {selectedUsers.length > 0 && (
              <div>
                <label htmlFor="" className="text-sm font-medium">
                  Selected Members ({selectedUsers.length})
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUsers.map((u) => {
                    return (
                      <span
                        key={u._id}
                        className="flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-full text-sm text-indigo-700"
                      >
                        <img
                          src={
                            u.pic ||
                            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                          }
                          alt={u.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        {u.name}
                        <button
                          onClick={() => handleRemoveUser(u._id)}
                          className="hover:text-red-500"
                        >
                          <MdOutlineCancel className="h-4 w-4" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Search  */}

          <div className="space-y-3">
            <label htmlFor="" className="text-sm font-medium">
              Add Members
            </label>
            <div className="relative">
              <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Contacts..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-md border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          {/* render search users */}

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {searchResult?.slice(0, 4).map((user) => (
              <div
                key={user._id}
                user={user}
                onClick={() => handleUsersToggle(user)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.some((u) => u._id === user._id)}
                  readOnly
                  className="h-4 w-4"
                />

                <div className="relative">
                  <div className=" h-10 w-10 rounded-full bg-gray-300 justify-center flex items-center text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{user.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                {selectedUsers.some((u) => u._id === user._id) && (
                  <FaCheck className="h-5 w-5 text-indigo-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer  */}

        <div className="flex gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-md border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            // disabled={!groupName.trim() || selectedContacts.length === 0}
            className="flex-1 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
