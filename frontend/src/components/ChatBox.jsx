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

// import React from "react";
// import { ChatState } from "../context/ChatProvider";

// const ChatBox = ({ selectedChat, onBack }) => {
//   return (
//     <div
//       className={`transition-all duration-300 ease-in-out
//         ${selectedChat ? "flex" : "hidden"} md:flex
//         flex-col w-full h-full bg-white p-4 border-l border-gray-200`}
//     >
//       {/* Back button visible only on mobile */}
//       {selectedChat && (
//         <button
//           onClick={onBack}
//           className="md:hidden mb-3 text-indigo-600 font-medium hover:text-indigo-800 transition"
//         >
//           ← Back
//         </button>
//       )}

//       {selectedChat ? (
//         <div className="text-lg font-semibold">
//           Chat with:{" "}
//           <span className="text-indigo-600">
//             {selectedChat.chatName || "User"}
//           </span>
//         </div>
//       ) : (
//         <div className="text-gray-400 text-center mt-10">
//           Select a chat to start messaging
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBox;
