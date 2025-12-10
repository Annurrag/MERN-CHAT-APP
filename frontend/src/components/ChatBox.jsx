import React from "react";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain, onBack }) => {
  const { selectedChat } = ChatState();
  return (
    <div
      className={`
    ${selectedChat ? "flex" : "hidden"} md:flex
    items-center flex-col
    p-3 bg-gray-100
    w-full 
    rounded-lg border border-gray-100
  `}
    >
      <SingleChat
        onBack={onBack}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
    </div>
  );
};

export default ChatBox;
