import React from "react";
import { useNavigate } from "react-router-dom";

export default function ModernHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove stored token
    localStorage.removeItem("token");

    // Remove Telegram authentication (adjust key if needed)
    localStorage.removeItem("telegramAuth");

    // Redirect to home page
    navigate("/");
  };

  return (
    <header
      className="w-full py-4 px-6 flex justify-between items-center 
                 bg-background/20 backdrop-blur-md border border-white/20 
                 shadow-medium transition-all duration-500 hover:shadow-heavy hover:-translate-y-1"
    >
      {/* App Name on the left */}
      <h1
        className="text-3xl font-extrabold text-[var(--text-accent)] tracking-widest font-sans 
                   transition-transform duration-300 hover:scale-105 hover:text-secondary"
      >
        Heychat
      </h1>

      {/* Logout button on the right */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md 
                   hover:bg-red-600 transition-colors duration-300"
      >
        Log Out
      </button>
    </header>
  );
}
