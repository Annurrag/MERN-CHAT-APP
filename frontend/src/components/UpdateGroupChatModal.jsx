import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { ChatState } from "../context/ChatProvider";
import { toast } from "react-toastify";
import axios from "axios";
import UserListItem from "./UserAvatar/UserListItem";

const UpdateGroupChatModal = ({
  fetchAgain,
  setFetchAgain,
  fetchMessages,
  isOpen,
  onClose,
}) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  //close modal if selectedchat is cleared
  useEffect(() => {
    if (!selectedChat || !selectedChat.isGroupChat) {
      onClose();
    }
  }, [selectedChat]);

  const handleRemove = async (user1, isLeave = false) => {
    // console.log("handle remove clicked");
    if (!isLeave && selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only Admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      if (isLeave) {
        setSelectedChat(""); // leave group
        toast.success("You have left the group!");
      } else {
        setSelectedChat(data); // update chat with removed user
        toast.success(`${user1.name} removed from group`);
      }

      // user1._id === user._id ? setSelectedChat("") : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast.error("Error Occurred!");
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already in group!");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only Admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error("Error Occurred!");
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      //   console.log(data);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      toast.success("Group renamed successfully!");

      setGroupChatName("");
      setRenameLoading(false);
    } catch (error) {
      toast.error("Failed to rename the Group Chat!");
      setRenameLoading(false);
    }
  };

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
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      console.log(data);

      setSearchResult(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <>
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
            <h2 className="text-xl font-semibold justify-center">
              {selectedChat.chatName.toUpperCase()}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <MdOutlineCancel className="h-5 w-5" />
            </button>
          </div>
          <div className=" flex flex-wrap gap-2 m-4 p-2 ">
            {selectedChat.users.map((u) => {
              return (
                <span
                  key={u._id}
                  admin={selectedChat.groupAdmin}
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
                    onClick={() => handleRemove(u)}
                    className="hover:text-red-500"
                  >
                    <MdOutlineCancel className="h-4 w-4" />
                  </button>
                </span>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 m-2">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <input
                type="text"
                placeholder="Enter Group Name..."
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                className="flex-grow px-3 py-2 rounded-md border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                className="w-full sm:w-[30%] px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition"
                onClick={handleRename}
              >
                Update
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <input
                type="text"
                placeholder="Add User to group..."
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-grow px-3 py-2 rounded-md border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-transparent">
              {searchResult.slice(0, 10).map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t">
            <button
              onClick={() => handleRemove(user, true)}
              className="flex-1 px-4 py-2 rounded-md border hover:bg-blue-200"
            >
              Leave Group
            </button>
            <button
              //   onClick={handleCreateGroup}
              // disabled={!groupName.trim() || selectedContacts.length === 0}
              className="flex-1 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateGroupChatModal;
