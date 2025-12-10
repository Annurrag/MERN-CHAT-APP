import React, { useEffect, useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("login");

  const toggleView = () => {
    setCurrentView(currentView === "login" ? "signup" : "login");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <div>
      {currentView === "login" ? (
        <Login onToggle={toggleView} />
      ) : (
        <SignUp onToggle={toggleView} />
      )}
    </div>
  );
};

export default HomePage;
