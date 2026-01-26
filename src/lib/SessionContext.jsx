import { createContext, useContext, useEffect, useState } from "react";
import api from "./axios";
import { setSessionData, getSessionData, getUserData } from "./auth";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSessionStatus();
  }, []);

  // Hanya check session untuk cashier role
  const shouldCheckSession = () => {
    const role = localStorage.getItem("role");
    return role === "cashier";
  };

  const checkSessionStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Hanya check session untuk cashier
      if (!shouldCheckSession()) {
        setLoading(false);
        return;
      }

      // Fetch current active session dari backend
      const res = await api.get("/cashier-sessions/current");
      
      if (res.data) {
        const sessionData = {
          id: res.data.id,
          user_id: res.data.user_id,
          shift_id: res.data.shift_id,
          opening_balance: res.data.opening_balance,
          closing_balance: res.data.closing_balance,
          is_open: res.data.is_open || res.data.closing_at === null,
          opened_at: res.data.opened_at,
          closed_at: res.data.closed_at,
        };
        
        setSessionData(sessionData);
        setSession(sessionData);
      } else {
        setSession(null);
      }
    } catch (error) {
      // 404 atau error lain berarti tidak ada active session
      if (error.response?.status === 404) {
        // Normal - endpoint return 404 saat tidak ada active session
        setSession(null);
      } else if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        // Network error - skip
        console.debug("Session check: Network error");
        setSession(null);
      } else {
        // Other errors
        console.debug("Session check failed:", error.message);
        setSession(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    await checkSessionStatus();
  };

  const value = {
    session,
    loading,
    isSessionOpen: session?.is_open || false,
    refreshSession,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
