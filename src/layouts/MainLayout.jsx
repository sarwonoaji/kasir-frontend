import { Link, Navigate } from "react-router-dom";
import { isLoggedIn, logout } from "../lib/auth";
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import LogoutIcon from '@mui/icons-material/Logout';
import StoreIcon from '@mui/icons-material/Store';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100%", height: "100%", backgroundColor: "#f8f9fa", width: "100%", boxSizing: 'border-box' }}>
      <aside style={{
        width: 250,
        backgroundColor: "#007bff",
        color: "white",
        padding: "20px",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        overflowY: "auto",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
        zIndex: 1000
      }}>
        <h3 style={{
          margin: "0 0 30px 0",
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <StoreIcon style={{ marginRight: "10px" }} />
          POS Kasir
        </h3>
        <nav>
          <Link to="/dashboard" style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 15px",
            marginBottom: "10px",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
          >
            <DashboardIcon style={{ marginRight: "10px" }} />
            Dashboard
          </Link>
          <Link to="/products" style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 15px",
            marginBottom: "10px",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
          >
            <InventoryIcon style={{ marginRight: "10px" }} />
            Produk
          </Link>
          <Link to="/products-in" style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 15px",
            marginBottom: "10px",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
          >
            <MoveToInboxIcon style={{ marginRight: "10px" }} />
            Barang Masuk
          </Link>
          <Link to="/products-out" style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 15px",
            marginBottom: "20px",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
          >
            <OutboxIcon style={{ marginRight: "10px" }} />
            Barang Keluar
          </Link>
          <hr style={{ borderColor: "rgba(255,255,255,0.3)", margin: "20px 0" }} />
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#c82333"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#dc3545"}
          >
            <LogoutIcon style={{ marginRight: "10px" }} />
            Logout
          </button>
        </nav>
      </aside>

      <main style={{
        padding: 20,
        flex: 1,
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        boxSizing: 'border-box',
        marginLeft: sidebarOpen ? 250 : 0,
        transition: "margin-left 0.3s ease",
        width: "100%"
      }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "fixed",
            top: "10px",
            left: "10px",
            zIndex: 1001,
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          <MenuIcon />
        </button>
        {children}
      </main>
    </div>
  );
}
