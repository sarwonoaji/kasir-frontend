import { Link, Navigate } from "react-router-dom";
import { isLoggedIn, logout } from "../lib/auth";

export default function MainLayout({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: 200, background: "#eee", padding: 20 }}>
        <h3>POS</h3>
        <nav>
          <div><Link to="/dashboard">Dashboard</Link></div>
          <div><Link to="/products">Products</Link></div>
          <hr />
          <button onClick={logout}>Logout</button>
        </nav>
      </aside>

      <main style={{ padding: 20, flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
