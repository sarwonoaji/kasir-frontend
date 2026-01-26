# Konsep Session Management untuk Cashier

## Overview
Setelah cashier login, sistem akan mengecek apakah session kasir mereka sudah dibuka. Berdasarkan status session ini, akses ke fitur transaksi akan dibatasi.

## Alur Kerja

### 1. **Login Cashier**
```
┌─────────────────┐
│   Cashier Login │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│  Check Session Status│
│   (SessionContext)   │
└────────┬─────────────┘
         │
    ┌────┴──────┐
    │            │
    ▼            ▼
┌─────────┐  ┌──────────┐
│ Terbuka │  │ Belum    │
│         │  │ Terbuka  │
└────┬────┘  └────┬─────┘
     │            │
     ▼            ▼
┌──────────┐  ┌──────────────┐
│ Akses    │  │ Redirect ke  │
│ Penuh    │  │ Buka Session │
│ Transaksi│  │ (Read-Only   │
└──────────┘  │  mode)       │
              └──────────────┘
```

### 2. **Session Status**
- **Session Terbuka** ✓
  - Cashier dapat melakukan semua transaksi
  - Dapat membuat/edit produk masuk dan keluar
  - Dapat mengelola shift
  - Dashboard menampilkan "Session Kasir Aktif"

- **Session Belum Dibuka** ⚠️
  - Cashier TIDAK dapat melakukan transaksi
  - Hanya bisa melihat stok produk (read-only)
  - Dashboard menampilkan "Session Kasir Belum Dibuka" dengan tombol "Buka Session"
  - Jika coba akses route transaksi, akan di-redirect ke `/cashier-sessions/open`

## Struktur File

### 1. **lib/auth.jsx** - Authentication & Session Storage
```javascript
// Functions yang ditambahkan:
- isSessionOpen()        // Cek apakah session sudah dibuka
- getSessionData()       // Ambil data session dari localStorage
- setSessionData()       // Simpan data session
- getUserData()          // Ambil data user
- setUserData()          // Simpan data user
- clearSessionData()     // Hapus session data
```

### 2. **lib/SessionContext.jsx** - Global Session State (BARU)
Context untuk manage session status secara global:
```javascript
SessionProvider      // Provider component untuk wrap app
useSession()         // Hook untuk akses session di component
  ├─ session         // Data session saat ini
  ├─ loading         // Status loading
  ├─ isSessionOpen   // Boolean status session
  └─ refreshSession()// Refresh session dari backend
```

**Fetch ke Backend:**
- `GET /cashier-sessions/current` - Ambil active session

### 3. **lib/ProtectedRoute.jsx** - Route Protection (BARU)
Component untuk proteksi route yang memerlukan active session:
```javascript
<ProtectedRoute>
  <ComponentThatNeedsSession />
</ProtectedRoute>
```

**Logic:**
1. Cek login
2. Cek session status
3. Jika belum open → redirect ke `/cashier-sessions/open`

### 4. **App.jsx** - Route Configuration (UPDATED)
Struktur routing dengan SessionProvider dan ProtectedRoute:

**Read-Only Routes** (Bisa akses tanpa session):
- `/dashboard` - Dashboard
- `/shift` - Lihat shift (baca saja)
- `/products` - Lihat produk/stok

**Protected Routes** (Perlu active session):
- `/shift/create` - Buat shift
- `/shift/edit/:id` - Edit shift
- `/products/create` - Buat produk
- `/products-in/*` - Barang masuk (semua operasi)
- `/products-out/*` - Barang keluar (semua operasi)
- `/users/*` - Manajemen user
- `/cashier-sessions/active` - Active session (detail)

**Public Routes** (Tidak perlu login):
- `/login` - Login page

### 5. **layouts/MainLayout.jsx** - UI Update (UPDATED)
Menampilkan status session:

**Saat session aktif:**
```
✓ Session Kasir Aktif
  Saldo Pembukaan: Rp XXX.XXX
```

**Saat session belum dibuka:**
```
⚠ Session Kasir Belum Dibuka
  Anda tidak dapat melakukan transaksi sampai membuka session...
  [BUKA SESSION]
```

## Flow Implementasi Backend

### Endpoint yang dibutuhkan:
1. **POST /login**
   - Response harus include user data dan session data
   - Simpan ke localStorage via `setUserData()` dan `setSessionData()`

2. **GET /cashier-sessions/current** ⭐ PENTING
   - Return active session untuk user saat ini
   - Jika tidak ada active session, return 404 atau null
   - Response format:
   ```json
   {
     "id": 1,
     "user_id": 1,
     "shift_id": 1,
     "opening_balance": 500000,
     "closing_balance": null,
     "is_open": true,
     "opened_at": "2024-01-26 08:00:00",
     "closed_at": null
   }
   ```

3. **POST /cashier-sessions/open**
   - Buat session baru untuk user
   - Response harus di-simpan ke localStorage

4. **POST /cashier-sessions/close** (jika ada)
   - Close current session

## Implementasi di Component

### Contoh: Components yang perlu session check

Untuk form transaksi (ProductIn/ProductOut create):
```javascript
import { useSession } from "../lib/SessionContext";

export default function ProductInCreate() {
  const { session, isSessionOpen } = useSession();
  
  // Session sudah dijamin active karena ProtectedRoute
  // Tapi bisa di-render UI berdasarkan session data
  
  return (
    <div>
      <p>Session: {session?.id}</p>
      <p>Opening Balance: {session?.opening_balance}</p>
      {/* Form transaksi */}
    </div>
  );
}
```

## Lifecycle Session

```
1. User Login
   ├─ SessionProvider fetch /cashier-sessions/current
   ├─ Jika ada → set session active
   └─ Jika tidak → session = null

2. User Navigate ke Protected Route
   ├─ ProtectedRoute check isSessionOpen
   ├─ Jika false → redirect /cashier-sessions/open
   └─ Jika true → render component

3. User Open Session
   ├─ POST /cashier-sessions/open
   ├─ Update localStorage session
   ├─ useSession hook refresh session
   └─ Dapat akses transaksi

4. User Close Session
   ├─ POST /cashier-sessions/close
   ├─ Update localStorage session (is_open = false)
   ├─ MainLayout alert berubah ke "Belum Dibuka"
   └─ Tidak bisa akses transaksi (ProtectedRoute redirect)

5. User Logout
   ├─ Clear token, user, session dari localStorage
   ├─ Redirect /login
   └─ SessionContext reset
```

## Testing Checklist

- [ ] Cashier login → MainLayout tunjukkan alert "Session Belum Dibuka"
- [ ] Klik "Buka Session" → navigate ke form open session
- [ ] Isi form open session → session berhasil dibuka
- [ ] MainLayout alert berubah menjadi "Session Kasir Aktif"
- [ ] Akses `/products-in/create` → bisa buka form (tidak di-redirect)
- [ ] Jika logout → login ulang, session check ulang dari backend
- [ ] Akses `/products` (read-only) → bisa tanpa session
- [ ] Coba akses `/products-in` tanpa session (edit localStorage) → di-redirect

## Notes

- Setiap navigasi, SessionContext melakukan fetch ke `/cashier-sessions/current`
- Session status di-store di localStorage untuk fast access
- Backend harus me-return 404 atau data kosong jika tidak ada active session
- Alert di MainLayout akan selalu updated via `useSession()` hook
- Read-only routes tetap bisa diakses (untuk lookup stok, dll)
