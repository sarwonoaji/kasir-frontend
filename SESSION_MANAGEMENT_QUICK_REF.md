# Session Management - Quick Reference

## 🎯 Konsep Utama

```
┌─────────────────────────────────────────────────────────────┐
│                     CASHIER LOGIN                            │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────▼──────────────┐
         │   Check Session Status       │
         │  (SessionContext → Backend)  │
         └───────────────┬──────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
     YES ▼                              ▼ NO
   ┌──────────────┐          ┌──────────────────────┐
   │   Session    │          │  Session Not Open    │
   │   Is Open    │          │  (Read-Only Access)  │
   └──────┬───────┘          └──────────┬───────────┘
          │                             │
          │                    ┌────────▼────────────┐
          │                    │  Show Alert:        │
          │                    │  "Session Belum     │
          │                    │   Dibuka"           │
          │                    │  [Buka Session]     │
          │                    └────────┬────────────┘
          │                             │
    ┌─────▼─────────────┐      ┌────────▼──────────────┐
    │ Can Access:       │      │ Can Access:           │
    │ ✓ Transaksi      │      │ ✓ Dashboard (view)    │
    │ ✓ Products In/Out│      │ ✓ Products (read-only)│
    │ ✓ Shift          │      │ ✓ Stok (read-only)    │
    │ ✓ Users          │      │ ✗ Transaksi          │
    │ ✓ All Operations │      │ ✗ Create/Edit ops    │
    └──────────────────┘      └──────────┬───────────┘
                                         │
                              ┌──────────▼──────────┐
                              │ Click "Buka Session"│
                              │ (Redirect to form)  │
                              └──────────┬──────────┘
                                         │
                              ┌──────────▼──────────┐
                              │ Fill & Submit Form   │
                              │ POST /cashier-      │
                              │ sessions/open       │
                              └──────────┬──────────┘
                                         │
                              ┌──────────▼──────────┐
                              │ Session Created ✓   │
                              │ (Redirect to active)│
                              └─────────────────────┘
```

## 📁 File Changes

### New Files Created:
1. **`src/lib/ProtectedRoute.jsx`** - Route protection component
2. **`src/lib/SessionContext.jsx`** - Global session state management
3. **`SESSION_MANAGEMENT_CONCEPT.md`** - This documentation

### Modified Files:
1. **`src/lib/auth.jsx`** 
   - Added: `isSessionOpen()`, `getSessionData()`, `setSessionData()`, `getUserData()`, `setUserData()`, `clearSessionData()`

2. **`src/App.jsx`**
   - Wrapped app with `<SessionProvider>`
   - Protected transaction routes with `<ProtectedRoute>`
   - Kept read-only routes unprotected

3. **`src/layouts/MainLayout.jsx`**
   - Added `useSession()` hook
   - Added session status alerts (success/warning)
   - Shows opening balance when session is active
   - Shows warning with "Buka Session" button when not open

## 🔄 Key Flows

### Scenario 1: Cashier Login & Open Session
```
1. Login with credentials
2. SessionProvider checks GET /cashier-sessions/current
3. No active session found
4. MainLayout shows ⚠️ "Session Belum Dibuka"
5. Cashier clicks "Buka Session"
6. Navigate to /cashier-sessions/open
7. Fill form (shift, opening_balance)
8. Submit POST /cashier-sessions/open
9. Session created
10. useSession() refreshes
11. MainLayout shows ✓ "Session Kasir Aktif"
12. Can now access transactions
```

### Scenario 2: Try Access Transaction Without Session
```
1. User tries to access /products-in
2. ProtectedRoute intercepts
3. Checks isSessionOpen()
4. Session is false
5. Navigate /cashier-sessions/open
6. User forced to open session first
```

### Scenario 3: View Stock Without Session
```
1. User accesses /products (read-only)
2. No ProtectedRoute protection
3. Component renders normally
4. Can see stok information
5. Cannot create/edit
```

## 🛠️ Backend Requirements

Your backend must provide:

### 1. GET `/cashier-sessions/current`
**When:** SessionProvider initialization and refresh
**Expected Response:**
```json
{
  "id": 1,
  "user_id": 5,
  "shift_id": 2,
  "opening_balance": 500000,
  "closing_balance": null,
  "is_open": true,
  "opened_at": "2024-01-26 08:00:00",
  "closed_at": null
}
```
**Or:** 404 / null if no active session

### 2. POST `/cashier-sessions/open`
**Payload:**
```json
{
  "shift_id": 2,
  "opening_balance": 500000
}
```
**Response:** Same format as current endpoint

### 3. POST `/cashier-sessions/close` (optional)
Close current session

## 🎨 UI Components

### Alert - Session Active
```
✓ Session Kasir Aktif
  Saldo Pembukaan: Rp 500.000
```

### Alert - Session Not Open
```
⚠ Session Kasir Belum Dibuka
  Anda tidak dapat melakukan transaksi sampai membuka session...
  [BUKA SESSION]
```

## 💾 localStorage Structure

```
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
    "opened_at": "2024-01-26 08:00:00"
  }
}
```

## ✅ Implementation Checklist

- [x] Created ProtectedRoute component
- [x] Created SessionContext with hook
- [x] Updated auth.jsx with session functions
- [x] Updated App.jsx with SessionProvider
- [x] Protected transaction routes
- [x] Added session alerts to MainLayout
- [ ] Implement Login page to set user/session data
- [ ] Ensure backend returns /cashier-sessions/current
- [ ] Test all scenarios above
- [ ] Handle session refresh on page reload
- [ ] Add session timeout logic (optional)

## 🔗 Hook Usage Examples

### In Any Component:
```javascript
import { useSession } from "../lib/SessionContext";

export default function MyComponent() {
  const { session, loading, isSessionOpen, refreshSession } = useSession();
  
  if (loading) return <div>Loading session...</div>;
  
  if (isSessionOpen) {
    return <div>Session ID: {session?.id}</div>;
  }
  
  return <div>No active session</div>;
}
```

## 📝 Notes

- SessionContext automatically fetches session status on app load
- ProtectedRoute prevents unauthorized access client-side (server-side validation still needed!)
- Read-only components do NOT use ProtectedRoute
- Logout clears all session data
- Session status persists on page reload via SessionContext fetch
