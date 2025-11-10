// components/atoms/InfoAlert.jsx
import React from "react";

export default function InfoAlert({ open, onClose, message, title = "Info", secondaryAction }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Alert box */}
      <div
        className="relative bg-white/90 text-gray-900 w-full max-w-md p-6 rounded-xl shadow-lg
                   flex flex-col items-center justify-center pointer-events-auto animate-pop-in"
      >
        {/* Dynamic title */}
        <h2 className="text-xl font-semibold mb-3 text-center">{title}</h2>

        {/* Bold message */}
        <p className="text-center text-sm leading-relaxed mb-6 font-bold">{message}</p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button onClick={onClose} className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition">
            Close
          </button>

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-300 text-gray-900 font-medium hover:bg-gray-400 transition"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
