import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TelegramLoginWidget() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleTelegramAuth = async (user) => {
    try {
      const res = await fetch("/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const resJson = await res.json();

      if (!resJson.success) {
        const safeMessage = resJson.message || "Login failed.";
        throw new Error(safeMessage);
      }

      const { token, user: userData } = resJson.data;
      login(token, userData);
      navigate("/user/profile");
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("telegramOAuth");

      setError(err.message);
      setShowModal(true);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?15";
    script.async = true;
    script.setAttribute("data-telegram-login", "ENGLISH_CHAT_AI_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-request-access", "write");

    window.handleTelegramAuth = handleTelegramAuth;
    script.setAttribute("data-onauth", "handleTelegramAuth(user)");

    if (containerRef.current) containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
      delete window.handleTelegramAuth;
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="flex justify-center items-center"></div>

      {/* Glass-Style Error Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 p-4">
          <div className="bg-[var(--color-surface)]/80 backdrop-blur-md rounded-2xl shadow-[var(--color-shadow-heavy)] w-full max-w-sm sm:max-w-md p-4 sm:p-6 text-center border border-white/20 mx-auto">
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-error)] mb-2 sm:mb-3">Login Error</h2>
            <p className="text-sm sm:text-base text-[var(--color-text-primary)] mb-4 sm:mb-6 break-words">{error}</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="button-glass px-4 py-2 sm:px-6 font-bold text-[var(--color-text-primary)] hover:bg-white/25"
              >
                Close
              </button>

              <button
                onClick={() => navigate("/")}
                className="button-glass px-4 py-2 sm:px-6 font-bold text-[var(--color-text-primary)] hover:bg-white/25"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
