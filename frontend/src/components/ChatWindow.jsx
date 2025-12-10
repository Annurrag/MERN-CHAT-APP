import React, { useState } from "react";
import { RxAvatar } from "react-icons/rx";
// import { GoDotFill } from "react-icons/go";
import { FaPaperclip, FaRegSmile } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { ChatState } from "../context/ChatProvider";

const ChatWindow = ({ chatId, onBack }) => {
  const [message, setMessage] = useState("");

  const { selectedChat } = ChatState();

  if (!chatId) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Welcome Message */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <RxAvatar className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Welcome to ChatApp</h2>
            <p className="text-gray-500 mb-4">
              Select a conversation to start messaging
            </p>

            {/* Mobile CTA Button */}
            <button
              onClick={onBack}
              className="md:hidden bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow"
            >
              View Conversations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="lg:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
            >
              <IoArrowBack className="h-6 w-6 text-gray-700" />
            </button>
            <RxAvatar className="h-10 w-10" />
            {/* <AvatarFallback className="bg-blue-500 text-white">
                <Users className="h-5 w-5" />
              </AvatarFallback> */}

            <div>
              <h2 className="font-semibold">{currentChat.name}</h2>
              <div className="flex items-center gap-2">
                {currentChat.isGroup && (
                  <span className="text-sm text-gray-500">
                    {currentChat.memberCount} members
                  </span>
                )}
                <span className="text-xs flex items-center gap-1 bg-green-100 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div> */}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex gap-3 max-w-xs lg:max-w-md ${
                msg.isOwn ? "flex-row-reverse" : ""
              }`}
            >
              {!msg.isOwn && (
                <RxAvatar className="h-8 w-8 mt-1">
                  {/* <AvatarImage src={msg.senderAvatar} />
                  <AvatarFallback className="text-xs bg-gray-200 text-gray-700">
                    {msg.senderName?.charAt(0)}
                  </AvatarFallback> */}
                </RxAvatar>
              )}

              <div
                className={`flex flex-col ${
                  msg.isOwn ? "items-end" : "items-start"
                }`}
              >
                {!msg.isOwn && currentChat.isGroup && (
                  <span className="text-xs text-gray-500 mb-1 px-3">
                    {msg.senderName}
                  </span>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl shadow ${
                    msg.isOwn
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                <span className="text-xs text-gray-400 mt-1 px-2">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button>
            <FaPaperclip className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
          {/* <button variant="ghost" size="icon" className="hover:bg-gray-100">
            <Paperclip className="h-5 w-5" />
          </button> */}

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              // onKeyPress={handleKeyPress}
              className="w-full pr-12 px-4 py-2 rounded-full bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />

            <button className="absolute right-1 top-1/2 transform -translate-y-1/2 hover:bg-gray-200 mr-2 rounded-full p-1">
              <FaRegSmile />
            </button>
          </div>

          <button
            // onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-blue-400 hover:bg-blue-600 text-white shadow text-lg p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoMdSend className="h-5 w-5 " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
