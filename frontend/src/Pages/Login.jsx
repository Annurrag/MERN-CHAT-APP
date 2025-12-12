import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import bg from "../assets/bgimage.jpg";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../api";
// const axios = require("axios");

const Login = ({ onToggle }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("DEBUG VALUES:");
    console.log("Email:", `"${email}"`);
    console.log("Password:", `"${password}"`);

    if (!email || !password) {
      toast.warning("Please fill all the fields");
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await api.post(
        "/api/user/login",
        { email, password },
        config
      );
      toast.success("Login Successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error Occurred!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-auto md:h-[90vh] flex flex-col md:flex-row rounded-xl shadow-2xl overflow-hidden bg-white">
        {/* Left side - Form */}
        <div className="w-full md:flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <h3 className="text-3xl text-gray-700 mb-2 font-bold">
              Welcome Back
            </h3>
            <p className="text-gray-600 mb-6">Login to Your Account</p>

            {/* Social media buttons */}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FcGoogle className="text-xl" />
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FaFacebookF className="text-blue-600 text-xl" />
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Email Address
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder:text-sm placeholder:text-gray-500"
                  placeholder="Enter Your Email Address"
                  type="email"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder:text-sm placeholder:text-gray-500"
                    placeholder="Enter Your Password"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember checkbox and forgot password */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    type="checkbox"
                    id="remember"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-700 font-medium cursor-pointer"
                  >
                    Remember Me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-amber-600 text-sm font-medium hover:underline transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="w-full bg-amber-600 text-white font-bold rounded-lg py-3 hover:bg-amber-700 transition-colors"
              >
                Login
              </button>

              <p className="text-sm text-center text-gray-600">
                Don't Have an Account?
                <span
                  onClick={onToggle}
                  className="text-amber-600 hover:underline ml-2 cursor-pointer font-medium"
                >
                  Sign Up
                </span>
              </p>
            </form>
          </div>
        </div>

        {/* Right side - Background Image */}

        <div
          className="hidden md:flex md:flex-1 items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="text-center text-white p-8">
            <h2 className="text-4xl font-bold mb-4">Welcome!</h2>
            <p className="text-xl opacity-90 mb-6">Login to Chat With Others</p>

            <button
              onClick={onToggle}
              className="px-8 py-3 border-2 border-white rounded-lg font-bold hover:bg-white hover:text-amber-600 transition-all duration-300"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
