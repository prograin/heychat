import React from "react";
import { useAuthContext } from "../../auth/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MainHomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { logout } = useAuthContext();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6
                 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400
                 text-white"
    >
      <h1 className="text-5xl sm:text-6xl font-bold mb-10 text-center">Welcome to Home Page</h1>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center">
        {!token ? (
          <button
            className="w-full sm:w-36 py-3 text-lg font-medium
                       bg-white/20 backdrop-blur-sm text-white
                       rounded-md border-2 border-transparent
                       hover:border-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-red-400
                       transition-all duration-300 hover:scale-105"
            onClick={() => navigate("auth/telegram/login")}
          >
            Login
          </button>
        ) : (
          <button
            className="w-full sm:w-36 py-3 text-lg font-medium
                       bg-white/20 backdrop-blur-sm text-white
                       rounded-md border-2 border-transparent
                       hover:border-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-red-400
                       transition-all duration-300 hover:scale-105"
            onClick={logout}
          >
            Logout
          </button>
        )}

        <button
          className="w-full sm:w-36 py-3 text-lg font-medium
                     bg-white/20 backdrop-blur-sm text-white
                     rounded-md border-2 border-transparent
                     hover:border-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-red-400
                     transition-all duration-300 hover:scale-105"
          onClick={() => navigate("/user/profile")}
        >
          Profile
        </button>
      </div>
    </div>
  );
}
