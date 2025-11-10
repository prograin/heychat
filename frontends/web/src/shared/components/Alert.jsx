// components/atoms/InfoAlert.jsx
import React from "react";

export default function InfoAlert({ open, onClose, message }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white/90 text-gray-900 w-full max-w-md p-6 rounded-xl shadow-lg 
                   flex flex-col items-center justify-center pointer-events-auto animate-pop-in"
      >
        <h2 className="text-xl font-semibold mb-3">Logged Out</h2>
        <p className="text-center text-sm leading-relaxed mb-4">{message}</p>
        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition">
          Close
        </button>
      </div>
    </div>
  );
}
