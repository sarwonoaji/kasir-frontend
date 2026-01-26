# RECOMMENDED: Login.jsx Update untuk Session Management

## Issue Saat Ini
Login page hanya menyimpan `token` dan `user`, tetapi **TIDAK menyimpan `session` data**. 

Ini menyebabkan:
- SessionContext tidak bisa membaca session dari localStorage
- Perlu fetch `/cashier-sessions/current` saat pertama kali login

## Solusi (2 Pilihan)

### ✅ Option 1: Backend Return Session Data di Login Response (RECOMMENDED)

**Backend Response Format:**
```json
{
  "token": "eyJ0eXAi...",
  "user": {
    "id": 5,
    "name": "Joni Kasir",
    "email": "joni@kasir.com",
    "role": "cashier"
  },
  "session": {
    "id": 1,
    "user_id": 5,
    "shift_id": 2,
    "opening_balance": 500000,
    "is_open": true,
    "opened_at": "2024-01-26 08:00:00",
    "closed_at": null
  } // <- NEW: Bisa null jika tidak ada active session
}
```

**Update Login.jsx:**
```javascript
import { setSessionData } from "../lib/auth"; // Import ini

const submit = async () => {
  setLoading(true);
  setError("");
  try {
    const res = await api.post("/login", { email, password });
    console.log("Login response:", res.data);
    
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    
    // 🆕 NEW: Simpan session data (jika ada)
    if (res.data.session) {
      setSessionData(res.data.session);
    }
    
    // Redirect berdasarkan role
    if (res.data.role === "cashier") {
      window.location.href = "/dashboard"; // Ubah ke dashboard, bukan /cashier/create
    } else {
      window.location.href = "/dashboard";
    }
  } catch (err) {
    setError("Login gagal. Periksa email dan password Anda.");
  } finally {
    setLoading(false);
  }
};
```

---

### ⚠️ Option 2: Keep SessionContext fetch (Current Implementation)

SessionContext akan otomatis fetch `/cashier-sessions/current` saat app load:
- Tidak perlu update Login.jsx
- SessionProvider akan handle semuanya
- Backend hanya perlu endpoint `/cashier-sessions/current`

**Kelebihan:**
- Lebih simple, tidak perlu ubah backend login response
- SessionContext handle semua logic

**Kekurangan:**
- Ada delay saat loading pertama kali (perlu wait untuk fetch)
- Bisa loading state terlihat di UI

---

## ⭐ RECOMMENDED FLOW

1. **Backend:**
   - Update `POST /login` untuk return session data (bisa null)
   - Tetap maintain endpoint `GET /cashier-sessions/current`

2. **Frontend:**
   - Update Login.jsx untuk `setSessionData()` jika ada
   - SessionProvider tetap keep logic fallback ke fetch

3. **Result:**
   - Login flow instant (tidak perlu wait fetch)
   - More robust (fallback ke fetch jika needed)

---

## Code untuk Update Login.jsx

Ganti bagian `submit` function dengan:

```javascript
import { setSessionData } from "../lib/auth"; // Tambahkan import ini

const submit = async () => {
  setLoading(true);
  setError("");
  try {
    const res = await api.post("/login", { email, password });
    console.log("Login response:", res.data);
    
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    
    // Simpan session data jika ada (dari backend)
    if (res.data.session) {
      setSessionData(res.data.session);
    }
    
    console.log("User saved to localStorage:", res.data.user);
    
    // Redirect berdasarkan role
    // Semua redirect ke dashboard, SessionProvider akan handle session check
    if (res.data.role === "cashier") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/dashboard";
    }
  } catch (err) {
    setError("Login gagal. Periksa email dan password Anda.");
  } finally {
    setLoading(false);
  }
};
```

---

## Notes

- Jika backend belum update, app masih bisa jalan (SessionProvider akan fetch)
- Ini hanya untuk optimize, bukan requirement
- Test login flow setelah implementasi

---

## ✅ Current State (Tanpa Update)

Saat ini sistem sudah bisa jalan dengan SessionProvider yang fetch `/cashier-sessions/current`:

1. User login
2. Redirect to dashboard
3. MainLayout render
4. SessionProvider fetch `/cashier-sessions/current` (in background)
5. Session state update
6. Alert tampil berdasarkan status

⚠️ Ada delay ~ 1 detik sebelum alert tampil karena fetch async.

---

Silakan pilih option mana yang sesuai dengan timeline backend Anda! 🎯
