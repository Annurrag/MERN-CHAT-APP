import React from "react";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain, onBack }) => {
  const { selectedChat } = ChatState();
  return (
    <div
      className={`h-full w-full ${selectedChat ? "flex" : "hidden"} md:flex flex-col bg-white`}
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
