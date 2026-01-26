import { useState } from "react";
import api from "../lib/axios";
import { setSessionData, setUserData } from "../lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCashierRedirect = async (token) => {
    try {
      // Cek apakah ada active session
      const sessionRes = await api.get("/cashier-sessions/current", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Jika ada session aktif, langsung ke cashier/create
      if (sessionRes.data && sessionRes.data.is_open) {
        const sessionData = {
          id: sessionRes.data.id,
          user_id: sessionRes.data.user_id,
          shift_id: sessionRes.data.shift_id,
          opening_balance: sessionRes.data.opening_balance,
          closing_balance: sessionRes.data.closing_balance,
          is_open: sessionRes.data.is_open,
          opened_at: sessionRes.data.opened_at,
          closed_at: sessionRes.data.closed_at,
        };
        setSessionData(sessionData);
        window.location.href = "/cashier/create";
        return;
      }
    } catch (err) {
      // 404 atau error = tidak ada session aktif, tampilkan form open
      console.log("No active session, show open form");
    }
    
    // Jika tidak ada session aktif, tampilkan form open session
    window.location.href = "/chasier/session/open";
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/login", { email, password });
      console.log("Login response:", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      setUserData(res.data.user);
      console.log("User saved to localStorage:", res.data.user);
      
      // Jika cashier dan ada session data dari backend, simpan
      if (res.data.role === "cashier" && res.data.session) {
        setSessionData(res.data.session);
      }
      
      // Redirect berdasarkan role
      if (res.data.role === "cashier") {
        // Cashier: cek apakah ada active session
        // Jika ada → /cashier/create
        // Jika tidak → /chasier/session/open
        await handleCashierRedirect(res.data.token);
      } else {
        // Admin: langsung ke dashboard
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Login gagal. Periksa email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h2 style={{
          marginBottom: '20px',
          color: '#333',
          fontSize: '24px',
          fontWeight: '600'
        }}>Login Kasir</h2>

        {error && (
          <div style={{
            color: '#e74c3c',
            backgroundColor: '#fdf2f2',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#007bff')}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}
