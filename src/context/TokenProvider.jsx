import {useState, useEffect} from "react";
import { TokenContext } from "./TokenContext";

export function TokenProvider({ children }) {
  const [token, setToken] = useState(null);
  const appName = "KanbanProto";

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
  };

  return (
    <TokenContext.Provider value={{ token, login, logout, appName }}>
      {children}
    </TokenContext.Provider>
  );
}
