import React, { useRef, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { FaCamera } from "react-icons/fa";
import { ChatState } from "../context/ChatProvider";
import { api } from "../api";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, setUser } = ChatState();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState(user?.pic || "");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleImagePick = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setSelectedImage(result);
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmPicture = async () => {
    if (!selectedImage) return;

    try {
      setSaving(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await api.put("/api/user/profile", { pic: selectedImage }, config);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setPreviewUrl(data.pic || selectedImage);
      setSelectedImage("");
    } catch (error) {
      console.error("Failed to update profile picture", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      {/* Overlay  */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      {/* Modal Box  */}
      <div className="relative bg-white rounded-2xl shadow-lg max-w-md w-full max-4 max-h-[90vh] overflow-y-auto ">
        {/* header  */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Profile Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <MdOutlineCancel className="h-5 w-5" />
          </button>
        </div>

        {/* Content  */}
        <div className="p-6 space-y-6">
          {/* Avatar  */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={user?.name || "Profile"}
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-[#f3e4d3] flex items-center justify-center text-[#6b4f2f] text-2xl font-semibold border-4 border-white shadow-md">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <FaCamera className="h-4 w-4 text-[#6b4f2f]" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImagePick}
              />
            </div>

            {selectedImage && (
              <button
                type="button"
                onClick={handleConfirmPicture}
                disabled={saving}
                className="rounded-full bg-[#6b4f2f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#553a23] disabled:opacity-60"
              >
                {saving ? "Saving..." : "Confirm Picture"}
              </button>
            )}

            {/* Fix the status bar ..... */}

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                user.status === "online"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  user.status === "online" ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
              {user.status}
            </span>
          </div>

          {/* form  */}
          <div className="space-y-4">
            {/* name  */}
            <div className="space-y-1">
              <label htmlFor="" className="text-sm font-medium">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-indigo-300 focus:outline-none disabled:bg-gray-100 pr-10"
                />
              </div>
            </div>
            {/* Email  */}
            <div className="space-y-1">
              <label htmlFor="" className="text-sm font-medium">
                Email
              </label>
              <input
                type="text"
                value={user.email}
                disabled
                className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
