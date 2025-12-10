import React, { useEffect, useRef } from "react";
import { ChatState } from "../context/ChatProvider";
import { isSameSenderMargin, isSameUser } from "../config/ChatLogics";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const bottomRef = useRef(null);

  // Automatically scroll to bottom whenever messages update
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <div className="flex flex-col gap-[2px] justify-end w-full scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin overflow-y-auto">
        {messages &&
          messages.map((m, i) => (
            <div
              key={m._id}
              className={`flex ${
                m.sender._id === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`inline-block px-2 py-2 rounded-2xl max-w-[75%]
      ${m.sender._id === user._id ? "bg-blue-100" : "bg-green-100"}
      ${isSameUser(messages, m, i, user._id) ? "mt-[3px]" : "mt-[10px]"}
    `}
                style={{
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                }}
              >
                {m.content}
              </span>
            </div>
          ))}

        <div ref={bottomRef} />
      </div>
    </>
  );
};

export default ScrollableChat;
