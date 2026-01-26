# 📚 COMPONENT USAGE EXAMPLES

## 1. Use useSession Hook di Component

### Basic Usage
```javascript
import { useSession } from "../lib/SessionContext";

export default function MyTransactionForm() {
  const { session, loading, isSessionOpen } = useSession();
  
  // Loading state handling
  if (loading) {
    return <div>Checking session status...</div>;
  }
  
  // At this point, session is guaranteed to be open
  // (jika tidak open, ProtectedRoute sudah redirect)
  
  return (
    <div>
      <h3>Transaksi Barang Masuk</h3>
      <p>Session ID: {session?.id}</p>
      <p>Saldo Pembukaan: Rp {session?.opening_balance?.toLocaleString('id-ID')}</p>
      
      {/* Form transaksi */}
      <form onSubmit={handleSubmit}>
        {/* input fields */}
      </form>
    </div>
  );
}
```

### Advanced: Conditional Rendering
```javascript
import { useSession } from "../lib/SessionContext";

export default function Dashboard() {
  const { session, isSessionOpen } = useSession();
  
  return (
    <div>
      <h2>Dashboard</h2>
      
      {isSessionOpen ? (
        <div>
          <h3>Session Aktif ✅</h3>
          <p>Shift: {session?.shift_id}</p>
          <p>Saldo Awal: Rp {session?.opening_balance?.toLocaleString('id-ID')}</p>
          
          {/* Show transaction features */}
          <button onClick={goToProductsIn}>Input Barang</button>
          <button onClick={goToProductsOut}>Keluarkan Barang</button>
        </div>
      ) : (
        <div>
          <p>Buka session untuk mulai transaksi</p>
          {/* Show read-only content */}
          <StockOverview />
        </div>
      )}
    </div>
  );
}
```

---

## 2. Read-Only Component (Tidak Perlu Session)

### Product Stock View
```javascript
// Ini bisa di-akses tanpa session
// Tidak pakai ProtectedRoute di route definition

import { useState, useEffect } from "react";
import api from "../lib/axios";

export default function ProductIndex() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);
  
  return (
    <table>
      <thead>
        <tr>
          <th>Produk</th>
          <th>Stok</th>
          <th>Harga</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.stock}</td>
            <td>Rp {p.price?.toLocaleString('id-ID')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 3. Transaction Component (Memerlukan Session)

### Products In Create (Protected)
```javascript
// Route ini protected di App.jsx:
// <Route path="/products-in/create" element={<ProtectedRoute><ProductInCreate /></ProtectedRoute>}>

import { useState } from "react";
import api from "../lib/axios";
import { useSession } from "../lib/SessionContext";

export default function ProductInCreate() {
  const { session } = useSession();
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
    purchase_price: "",
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Session guaranteed to exist karena ProtectedRoute
    const payload = {
      cashier_session_id: session.id, // Gunakan session ID
      product_id: formData.product_id,
      quantity: formData.quantity,
      purchase_price: formData.purchase_price,
    };
    
    try {
      await api.post("/product-ins", payload);
      alert("Barang berhasil ditambahkan");
      // redirect atau refresh
    } catch (error) {
      alert("Error: " + error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Input Barang Masuk</h2>
      <p>Session: {session?.id}</p>
      
      <input
        type="number"
        placeholder="Product ID"
        value={formData.product_id}
        onChange={e => setFormData({...formData, product_id: e.target.value})}
        required
      />
      
      <input
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={e => setFormData({...formData, quantity: e.target.value})}
        required
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 4. Conditional Feature Based on Session

### Dashboard with Mixed Content
```javascript
import { useSession } from "../lib/SessionContext";

export default function Dashboard() {
  const { session, isSessionOpen, loading } = useSession();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* ALWAYS VISIBLE - Read-only stats */}
      <div className="stats">
        <div className="card">
          <h3>Total Produk</h3>
          <p>150 unit</p>
        </div>
        <div className="card">
          <h3>Stok Warning</h3>
          <p>5 produk</p>
        </div>
      </div>
      
      {/* CONDITIONAL - Session specific info */}
      {isSessionOpen && (
        <div className="session-active">
          <h2>Session Kasir Aktif ✅</h2>
          <p>Shift: {session?.shift_id}</p>
          <p>Opening Balance: Rp {session?.opening_balance?.toLocaleString('id-ID')}</p>
          <p>Session dibuka: {new Date(session?.opened_at).toLocaleString('id-ID')}</p>
          
          {/* Transaction shortcuts */}
          <div className="quick-actions">
            <button onClick={() => navigate('/products-in/create')}>
              📥 Input Barang
            </button>
            <button onClick={() => navigate('/products-out/create')}>
              📤 Keluarkan Barang
            </button>
          </div>
        </div>
      )}
      
      {!isSessionOpen && (
        <div className="session-not-open">
          <p>⚠️ Buka session untuk mulai transaksi</p>
        </div>
      )}
    </div>
  );
}
```

---

## 5. Button: Close Session (Optional)

### Close Session Component
```javascript
import { useNavigate } from "react-router-dom";
import { useSession } from "../lib/SessionContext";
import api from "../lib/axios";

export default function CloseSessionButton() {
  const navigate = useNavigate();
  const { session, refreshSession } = useSession();
  
  const handleCloseSession = async () => {
    if (!window.confirm("Close session sekarang?")) return;
    
    try {
      await api.post(`/cashier-sessions/${session.id}/close`, {
        closing_balance: 500000, // dari input
        notes: "Close session",
      });
      
      // Refresh session state
      await refreshSession();
      
      // Redirect or show success
      alert("Session closed");
      navigate("/cashier-sessions");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };
  
  if (!session) return null;
  
  return (
    <button 
      onClick={handleCloseSession}
      style={{ backgroundColor: 'red', color: 'white' }}
    >
      Close Session
    </button>
  );
}
```

---

## 6. Form dengan Dropdown Product (dari API)

```javascript
import { useState, useEffect } from "react";
import api from "../lib/axios";
import { useSession } from "../lib/SessionContext";

export default function TransactionForm() {
  const { session } = useSession();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  
  // Fetch products - bisa dari protected atau unprotected route
  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const product = products.find(p => p.id === parseInt(selectedProduct));
    
    await api.post("/transactions", {
      session_id: session.id,
      product_id: product.id,
      product_name: product.name,
      quantity: 5,
      price: product.price,
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Pilih Produk:
        <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
          <option value="">-- Pilih --</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} - Stok: {p.stock}
            </option>
          ))}
        </select>
      </label>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 7. Error Handling dengan Session

```javascript
import { useSession } from "../lib/SessionContext";
import api from "../lib/axios";
import { logout } from "../lib/auth";

export default function SafeTransaction() {
  const { session } = useSession();
  
  const handleTransaction = async (data) => {
    try {
      // Validate session still exists
      if (!session) {
        alert("Session expired, please login again");
        logout();
        return;
      }
      
      const response = await api.post("/transactions", {
        session_id: session.id,
        ...data,
      });
      
      return response.data;
    } catch (error) {
      // Handle 401 - session invalid
      if (error.response?.status === 401) {
        alert("Session invalid");
        logout();
        return;
      }
      
      // Handle other errors
      alert("Error: " + error.response?.data?.message);
    }
  };
  
  return (
    <button onClick={() => handleTransaction({quantity: 5})}>
      Submit Transaction
    </button>
  );
}
```

---

## 8. Middleware-like: Check Permission

```javascript
import { useSession } from "../lib/SessionContext";

// Custom hook untuk check permission
export function useCanTransact() {
  const { isSessionOpen, loading } = useSession();
  
  return {
    canCreate: isSessionOpen,
    canEdit: isSessionOpen,
    canDelete: isSessionOpen,
    canView: true, // Always true untuk read-only
    isLoading: loading,
  };
}

// Usage in component:
import { useCanTransact } from "../hooks/useCanTransact";

export default function ProductActions({ productId }) {
  const { canCreate, canEdit, canView } = useCanTransact();
  
  return (
    <div>
      {canView && <button>View</button>}
      {canEdit && <button>Edit</button>}
      {canCreate && <button>Duplicate</button>}
    </div>
  );
}
```

---

## 📝 Summary Table

| Feature | With Session | Without Session |
|---------|--------------|-----------------|
| View Dashboard | ✅ | ✅ |
| View Products | ✅ | ✅ |
| View Stock | ✅ | ✅ |
| Create Product In | ✅ | ❌ |
| Create Product Out | ✅ | ❌ |
| Edit Operations | ✅ | ❌ |
| View Session Info | ✅ (show active) | ✅ (show alert) |
| Access `/products-in/create` | ✅ | ❌ Redirect |

---

## 🎯 Best Practices

1. **Always wrap transaction form with `useSession()`**
   ```javascript
   const { session } = useSession();
   // Use session.id in API calls
   ```

2. **Include session ID in all transaction payloads**
   ```javascript
   const payload = {
     cashier_session_id: session.id,
     ...otherData
   };
   ```

3. **Handle session expiry gracefully**
   ```javascript
   if (!session) {
     navigate("/cashier-sessions/open");
   }
   ```

4. **Provide user feedback about session status**
   ```javascript
   {isSessionOpen ? (
     <p>✅ Siap bertransaksi</p>
   ) : (
     <p>⚠️ Buka session dulu</p>
   )}
   ```

5. **Always check `loading` before render sensitive content**
   ```javascript
   if (loading) return <Loader />;
   ```
