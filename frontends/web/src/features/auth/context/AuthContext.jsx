import { createContext, useContext, useState, useEffect } from "react";
import { clearTelegramCookies } from "../utils/telegramCookie.util.js";
import InfoAlert from "../../../shared/components/Alert.jsx";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  // optional: load user profile on first mount if a token exists
  //After run all child and dom , it will be runned
  useEffect(() => {
    if (token) {
      fetch("/profiles/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setUser(data))
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("telegramOAuth");

    clearTelegramCookies();
    setShowLogoutAlert(true);
  };

  const logoutMessage = `You have been logged out.For complete logout from Telegram, open the Telegram app → Settings → Privacy & Security → Active Websites → find "Heychat" → Log Out.`;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
      <InfoAlert open={showLogoutAlert} onClose={() => setShowLogoutAlert(false)} message={logoutMessage} title="Logged Out" />
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
