// components/atoms/ErrorModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorModal({ message }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      {/* Click outside to close */}
      <div className="absolute inset-0" />

      {/* Circular Modal with animation */}
      <div
        className="relative w-80 h-80 bg-[var(--color-error)]/10 border-2 border-[var(--color-error)] 
                   rounded-full flex flex-col items-center justify-center backdrop-blur-md 
                   shadow-[var(--color-shadow-medium)] text-center modal-pop-in"
      >
        {/* Title */}
        <h2 className="text-2xl font-bold mb-2 font-sans text-[var(--color-error)]">Error</h2>

        {/* Message */}
        <p className="px-6 text-center text-lg font-medium text-[var(--color-error)] leading-relaxed mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button onClick={() => navigate("/")} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Home
          </button>

          <button
            onClick={() => navigate("/auth/telegram/login")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
