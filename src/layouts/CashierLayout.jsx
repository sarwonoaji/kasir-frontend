import { Navigate, Link } from "react-router-dom";
import { isLoggedIn, logout } from "../lib/auth";
import { useSession } from "../lib/SessionContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Alert,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Store as StoreIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
} from "@mui/icons-material";

export default function CashierLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { session, isSessionOpen, loading } = useSession();

  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="fixed">
        <Toolbar>
          <StoreIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Kasir - Transaksi
          </Typography>
          
          {/* Session Status Di AppBar */}
          {!loading && isSessionOpen && (
            <Button
              color="inherit"
              size="small"
              startIcon={<HistoryIcon />}
              component={Link}
              to="/chasier/session/active"
              sx={{ mr: 2 }}
            >
              Session Aktif
            </Button>
          )}
          
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={logout}
            size="small"
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          pt: 10,
          px: 2,
          pb: 2,
          backgroundColor: 'background.default',
        }}
      >
        {/* Session Status Alert */}
        {!loading && (
          <>
            {isSessionOpen ? (
              <Alert
                severity="success"
                icon={<CheckCircleIcon />}
                sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    ✓ Session Kasir Aktif
                  </Typography>
                  <Typography variant="caption">
                    Saldo Pembukaan: Rp {session?.opening_balance?.toLocaleString('id-ID') || 0}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  component={Link}
                  to="/chasier/session/active"
                  sx={{ ml: 2 }}
                >
                  Lihat & Tutup Session
                </Button>
              </Alert>
            ) : (
              <Alert
                severity="warning"
                icon={<WarningIcon />}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    component={Link}
                    to="/cashier-sessions/open"
                  >
                    Buka Session
                  </Button>
                }
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    ⚠ Session Kasir Belum Dibuka
                  </Typography>
                  <Typography variant="caption">
                    Anda tidak dapat melakukan transaksi sampai membuka session kasir terlebih dahulu.
                  </Typography>
                </Box>
              </Alert>
            )}
          </>
        )}

        {/* Content */}
        {children}
      </Box>
    </Box>
  );
}
