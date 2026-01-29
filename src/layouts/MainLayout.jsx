import { Link, Navigate, useLocation } from "react-router-dom";
import { isLoggedIn, logout } from "../lib/auth";
import { useSession } from "../lib/SessionContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
  Alert,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  MoveToInbox as MoveToInboxIcon,
  Outbox as OutboxIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  People as PeopleIcon,
  CreditCard as CreditCardIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useState } from "react";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { session, isSessionOpen, loading } = useSession();
  const role = localStorage.getItem("role");
  const isCashier = role === "cashier";

  // Auto-close sidebar on mobile
  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on mobile when clicking menu item
  const handleMenuClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  const drawerWidth = 280;

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Shift', icon: <InventoryIcon />, path: '/shift' },
    { text: 'Produk', icon: <InventoryIcon />, path: '/products' },
    { text: 'Barang Masuk', icon: <MoveToInboxIcon />, path: '/products-in' },
    { text: 'Barang Keluar', icon: <OutboxIcon />, path: '/products-out' },
    { text: 'Laporan', icon: <CreditCardIcon />, path: '/reports' },
    { text: 'Session Kasir', icon: <CreditCardIcon />, path: '/cashier-sessions' },
    { text: 'Manajemen User', icon: <PeopleIcon />, path: '/users' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)'
      }}>
        <Typography variant="h6" fontWeight="bold" color="white">
          POS Kasir
        </Typography>
      </Box>

      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={handleMenuClick}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                color: 'white',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2, mb: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      <Box sx={{ p: 2 }}>
        <Button
          onClick={logout}
          fullWidth
          startIcon={<LogoutIcon />}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Sistem Point of Sale
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={sidebarOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'primary.main',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { md: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar /> {/* This creates space for the AppBar */}
        
        {/* Session Status Alert - Hanya untuk Cashier */}
        {!loading && isCashier && (
          <>
            {isSessionOpen ? (
              <Alert 
                severity="success" 
                icon={<CheckCircleIcon />}
                sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Session Kasir Aktif
                  </Typography>
                  <Typography variant="caption">
                    Saldo Pembukaan: Rp {session?.opening_balance?.toLocaleString('id-ID') || 0}
                  </Typography>
                </Box>
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
                    Session Kasir Belum Dibuka
                  </Typography>
                  <Typography variant="caption">
                    Anda tidak dapat melakukan transaksi sampai membuka session kasir terlebih dahulu. Anda masih dapat melihat data stok.
                  </Typography>
                </Box>
              </Alert>
            )}
          </>
        )}
        
        {children}
      </Box>
    </Box>
  );
}
