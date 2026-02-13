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
      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
      fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '50px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '4px',
          background: 'linear-gradient(90deg, #3b82f6, #1e40af)'
        }}></div>
        
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '10px',
            color: '#3b82f6'
          }}>🛒</div>
          <h2 style={{
            marginBottom: '10px',
            color: '#333',
            fontSize: '28px',
            fontWeight: '700'
          }}>Selamat Datang</h2>
          <p style={{
            color: '#666',
            fontSize: '16px',
            margin: '0'
          }}>Masuk ke Sistem Kasir</p>
        </div>

        {error && (
          <div style={{
            color: '#e74c3c',
            backgroundColor: '#fdf2f2',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '25px',
            fontSize: '14px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <span style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999',
            fontSize: '18px'
          }}>📧</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '15px 15px 15px 45px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s, box-shadow 0.3s',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ position: 'relative', marginBottom: '25px' }}>
          <span style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999',
            fontSize: '18px'
          }}>🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '15px 15px 15px 45px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s, box-shadow 0.3s',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            background: loading ? '#ccc' : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
            }
          }}
        >
          {loading ? '🔄 Masuk...' : 'Masuk'}
        </button>
      </div>
    </div>
  );
}
