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

  const GUEST_1_EMAIL = "guest12@gmail.com";
  const GUEST_1_PASSWORD = "guest@123";
  const GUEST_2_EMAIL = "guest21@gmail.com";
  const GUEST_2_PASSWORD = "guest@321";

  const handleLogin = async (e, emailValue, passwordValue) => {
    e.preventDefault();
    setLoading(true);

    if (!emailValue || !passwordValue) {
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
        { email: emailValue, password: passwordValue },
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

  const handleSubmit = async (e) => {
    await handleLogin(e, email, password);
  };

  const handleGuestLogin = (e, emailValue, passwordValue, label) => {
    e.preventDefault();
    setEmail(emailValue);
    setPassword(passwordValue);
    setShowPassword(true);
    toast.info(`${label} credentials filled. Please click Login to continue.`);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,180,114,0.25),_transparent_30%),linear-gradient(135deg,_#f8efe8_0%,_#f2e4d7_100%)] flex items-center justify-center px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden bg-white">
        {/* Left side - Form */}
        <div className="w-full md:flex-1 flex items-center justify-center px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 bg-white">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4 sm:mb-5">
              <img src="/chat-logo.svg" alt="Kataru logo" className="h-10 w-10 sm:h-12 sm:w-12" />
              <div>
                <h3 className="text-2xl sm:text-3xl text-gray-700 font-bold leading-tight">
                  Kataru
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Login to your account
                </p>
              </div>
            </div>

            {/* Social media buttons */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
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
            <div className="flex items-center gap-4 mb-4 sm:mb-5">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Email Address
                </label>
                <input
                  value={email}
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
                    value={password}
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
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5">
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
                className="w-full bg-amber-600 text-white font-bold rounded-lg py-2.5 hover:bg-amber-700 transition-colors"
              >
                Login
              </button>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={(e) =>
                    handleGuestLogin(
                      e,
                      GUEST_1_EMAIL,
                      GUEST_1_PASSWORD,
                      "Guest 1"
                    )
                  }
                  className="flex-1 bg-indigo-600 text-white font-bold rounded-lg py-3 hover:bg-indigo-700 transition-colors"
                >
                  Guest 1 Credentials
                </button>
                <button
                  type="button"
                  onClick={(e) =>
                    handleGuestLogin(
                      e,
                      GUEST_2_EMAIL,
                      GUEST_2_PASSWORD,
                      "Guest 2"
                    )
                  }
                  className="flex-1 bg-amber-600 text-white font-bold rounded-lg py-3 hover:bg-amber-700 transition-colors"
                >
                  Guest 2 Credentials
                </button>
              </div>

              

              <p className="text-sm text-center text-gray-600 pt-0.5">
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
