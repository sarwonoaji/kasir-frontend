import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./auth";
import { useSession } from "./SessionContext";
import { Box, CircularProgress } from "@mui/material";

/**
 * ProtectedRoute - untuk melindungi route yang memerlukan active cashier session
 * HANYA untuk CASHIER role
 */
export default function ProtectedRoute({ children }) {
  const role = localStorage.getItem("role");
  const { isSessionOpen, loading } = useSession();
  
  // Cek login dulu
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  // Admin tidak perlu session check
  if (role !== "cashier") {
    return children;
  }

  // Loading session - tampilkan spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Cek apakah session sudah open
  if (!isSessionOpen) {
    // Redirect ke halaman open session dengan pesan
    return <Navigate to="/chasier/session/open" />;
  }

  return children;
}
