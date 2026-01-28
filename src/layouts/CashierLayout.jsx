import { Navigate, Link } from "react-router-dom";
import { isLoggedIn, logout } from "../lib/auth";
import { useSession } from "../lib/SessionContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Store as StoreIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";

export default function CashierLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { session, isSessionOpen, loading } = useSession();
  const [userInfo, setUserInfo] = useState({ name: "User", email: "" });
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Ambil user info dari localStorage
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        if (userData.name) {
          setUserInfo(userData);
        } else if (userData.user && userData.user.name) {
          setUserInfo(userData.user);
        }
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
            size="small"
            startIcon={<InventoryIcon />}
            component={Link}
            to="/cashier/stock"
            sx={{ mr: 2 }}
          >
            Lihat Stock
          </Button>

          <Button
            color="inherit"
            size="small"
            startIcon={<InventoryIcon />}
            component={Link}
            to="/cashier/history"
            sx={{ mr: 2 }}
          >
            Riwayat Transaksi
          </Button>

          <Button
            color="inherit"
            size="small"
            startIcon={<InventoryIcon />}
            component={Link}
            to="/cashier/create"
            sx={{ mr: 2 }}
          >
            Buat Transaksi
          </Button>
          
          {/* User Info & Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
            <Typography variant="body2">
              {userInfo.name}
            </Typography>
            <IconButton
              onClick={handleMenuOpen}
              sx={{ 
                p: 0,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: '#ff9800',
                  cursor: 'pointer'
                }}
              >
                {userInfo.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem disabled>
                <Typography variant="body2" color="textSecondary">
                  {userInfo.email}
                </Typography>
              </MenuItem>
              <MenuItem onClick={logout} sx={{ color: 'error.main' }}>
                <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
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
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="body2" color="success.main" fontWeight="medium">
                    Session Kasir Aktif
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  component={Link}
                  to="/chasier/session/active"
                >
                  Kelola
                </Button>
              </Box>
            ) : (
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon color="warning" fontSize="small" />
                  <Typography variant="body2" color="warning.main" fontWeight="medium">
                    Session Kasir Belum Dibuka
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  component={Link}
                  to="/chasier/session/open"
                >
                  Buka Session
                </Button>
              </Box>
            )}
          </>
        )}

        {/* Content */}
        {children}
      </Box>
    </Box>
  );
}
