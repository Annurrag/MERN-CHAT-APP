import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { RxAvatar } from "react-icons/rx";

const UserListItem = ({ user, handleFunction }) => {
  // const { user } = ChatState();

  return (
    <div
      onClick={handleFunction}
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 hover:bg-gray-100 bg-indigo-100 border border-indigo-200"
    >
      {/* Avatar */}
      <div className="relative">
        {user.pic ? (
          <img
            src={user.pic}
            alt={user.name.charAt(0)}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <RxAvatar className="h-12 w-12 text-indigo-200" />
        )}

        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-sm truncate">{user.name}</h3>
          <span className="text-xs text-gray-500">{user.timestamp}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">{user.email}</p>

          {/* {user.unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-500 text-white rounded-full">
              {user.unreadCount}
            </span>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
