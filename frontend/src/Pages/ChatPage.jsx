import React, { useState } from "react";
import ChatSideBar from "../components/ChatSideBar";
import ProfileModal from "../components/ProfileModal";
import CreateGroupModal from "../components/CreateGroupModal";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import { ChatState } from "../context/ChatProvider";

const ChatPage = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  const { selectedChat, setSelectedChat } = ChatState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [fetchAgain, setFetchAgain] = useState(false);
  const handleBack = () => {
    setSelectedChat(null);
    setIsSidebarOpen(true);
  };

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div className="flex h-dvh overflow-hidden bg-[linear-gradient(135deg,_#f8efe8_0%,_#f4e9dc_100%)] text-slate-800">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 right-0 z-50 w-full border-r border-slate-200 bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:right-auto md:w-80 md:shadow-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <ChatSideBar
          onChatSelect={(chat) => {
            setSelectedChat(chat);
            if (window.innerWidth < 768) {
              setIsSidebarOpen(false);
            }
          }}
          onCreateGroup={() => setIsCreateGroupModalOpen(true)}
          onProfileClick={() => setIsProfileModalOpen(true)}
          selectedChat={selectedChat}
          onLogout={() => {
            // clear auth and redirect to login
            localStorage.removeItem("userInfo");
            navigate("/login");
          }}
          user={user}
          fetchAgain={fetchAgain}
        />
      </div>

      {/* Chat Box */}
      <div className="flex-1 min-w-0 h-full">
        <ChatBox
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          onBack={handleBack}
        />
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
      />
    </div>
  );
};

export default ChatPage;
