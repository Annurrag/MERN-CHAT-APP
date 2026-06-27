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
      <div className="flex flex-col gap-[2px] justify-end w-full scrollbar-thumb-slate-300 scrollbar-track-transparent scrollbar-thin overflow-y-auto">
        {messages &&
          messages.map((m, i) => (
            <div
              key={m._id}
              className={`flex ${
                m.sender._id === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`inline-block px-3.5 py-2.5 rounded-2xl max-w-[80%] text-sm leading-6 shadow-sm
      ${m.sender._id === user._id ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200"}
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
