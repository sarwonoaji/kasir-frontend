import { useState, useEffect } from "react";
import api from "../lib/axios";
import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Timeline as TimelineIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    total_sales_today: 0,
    total_transactions_today: 0,
    total_sales_month: 0,
    low_stock_products_count: 0,
    recent_transactions: [],
  });
  const [loading, setLoading] = useState(true);

  const formatNumber = (num) => {
    if (num === null || num === undefined || num === '') return '0.00';
    const number = parseFloat(num);
    if (isNaN(number)) return '0.00';
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/dashboard");
        setDashboardData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Penjualan Hari Ini',
      value: `Rp ${formatNumber(dashboardData.total_sales_today || 0)}`,
      icon: <MoneyIcon />,
      color: 'success',
      bgColor: 'success.light',
    },
    {
      title: 'Transaksi Hari Ini',
      value: dashboardData.total_transactions_today || 0,
      icon: <ShoppingCartIcon />,
      color: 'primary',
      bgColor: 'primary.light',
    },
    {
      title: 'Penjualan Bulan Ini',
      value: `Rp ${formatNumber(dashboardData.total_sales_month || 0)}`,
      icon: <TrendingUpIcon />,
      color: 'info',
      bgColor: 'info.light',
    },
    {
      title: 'Produk Stok Rendah',
      value: dashboardData.low_stock_products_count || 0,
      icon: <InventoryIcon />,
      color: 'warning',
      bgColor: 'warning.light',
    },
  ];

  if (loading) return (
    <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="primary">Memuat dashboard...</Typography>
      </Box>
    </Container>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <DashboardIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          Dashboard Kasir
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={3} sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color={`${stat.color}.main`}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.bgColor}`, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Transactions */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ borderRadius: 2, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TimelineIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Transaksi Terbaru
              </Typography>
            </Box>
            <List>
              {dashboardData.recent_transactions?.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Tidak ada transaksi terbaru
                </Typography>
              ) : (
                dashboardData.recent_transactions?.map((transaction, index) => (
                  <Box key={transaction.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                          <ShoppingCartIcon sx={{ fontSize: 16 }} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={`Invoice: ${transaction.invoice_number || `INV-${transaction.id}`}`}
                        secondary={`${transaction.user?.name || 'N/A'} - Rp ${formatNumber(transaction.total || 0)} - ${new Date(transaction.date).toLocaleDateString()}`}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                      />
                    </ListItem>
                    {index < dashboardData.recent_transactions.length - 1 && <Divider />}
                  </Box>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
