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
  Star as StarIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    productsInToday: 0,
    productsOutToday: 0,
    revenueToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const [productsRes, productsInRes, productsOutRes] = await Promise.all([
          api.get("/products"),
          api.get("/product-ins"),
          api.get("/product-outs"),
        ]);

        const totalProducts = productsRes.data.length;

        // Calculate today's data (simplified - in real app you'd filter by date)
        const today = new Date().toISOString().split('T')[0];
        const productsInToday = productsInRes.data.filter(p => p.date === today).length;
        const productsOutToday = productsOutRes.data.filter(p => p.date === today).length;

        // Calculate revenue from today's sales
        const revenueToday = productsOutRes.data
          .filter(p => p.date === today)
          .reduce((sum, p) => sum + p.details.reduce((s, d) => s + Number(d.total_price), 0), 0);

        setStats({
          totalProducts,
          productsInToday,
          productsOutToday,
          revenueToday,
        });

        // Mock recent activities (in real app, this would come from API)
        setRecentActivities([
          { text: 'Produk "Beras 5kg" ditambahkan', time: '2 jam lalu', type: 'add' },
          { text: 'Penjualan produk "Minyak Goreng" sebanyak 5 unit', time: '3 jam lalu', type: 'sale' },
          { text: 'Stok "Gula 1kg" diperbarui', time: '5 jam lalu', type: 'update' },
          { text: 'Produk "Teh Celup" masuk 20 dus', time: '6 jam lalu', type: 'in' }
        ]);

        // Mock top products (in real app, this would come from API)
        setTopProducts([
          { name: 'Beras 5kg', sales: 50 },
          { name: 'Minyak Goreng 2L', sales: 30 },
          { name: 'Gula 1kg', sales: 25 },
          { name: 'Teh Celup', sales: 20 }
        ]);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Produk',
      value: stats.totalProducts,
      icon: <InventoryIcon />,
      color: 'primary',
      bgColor: 'primary.light',
    },
    {
      title: 'Produk Masuk Hari Ini',
      value: stats.productsInToday,
      icon: <ShoppingCartIcon />,
      color: 'success',
      bgColor: 'success.light',
    },
    {
      title: 'Produk Keluar Hari Ini',
      value: stats.productsOutToday,
      icon: <TrendingUpIcon />,
      color: 'warning',
      bgColor: 'warning.light',
    },
    {
      title: 'Pendapatan Hari Ini',
      value: `Rp ${stats.revenueToday.toLocaleString()}`,
      icon: <MoneyIcon />,
      color: 'info',
      bgColor: 'info.light',
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

      {/* Activities and Top Products */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ borderRadius: 2, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TimelineIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Aktivitas Terbaru
              </Typography>
            </Box>
            <List>
              {recentActivities.map((activity, index) => (
                <Box key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                        {activity.type === 'add' && <InventoryIcon sx={{ fontSize: 16 }} />}
                        {activity.type === 'sale' && <ShoppingCartIcon sx={{ fontSize: 16 }} />}
                        {activity.type === 'update' && <TrendingUpIcon sx={{ fontSize: 16 }} />}
                        {activity.type === 'in' && <MoneyIcon sx={{ fontSize: 16 }} />}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.text}
                      secondary={activity.time}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ borderRadius: 2, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <StarIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Produk Terlaris
              </Typography>
            </Box>
            <List>
              {topProducts.map((product, index) => (
                <Box key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Chip
                        label={index + 1}
                        size="small"
                        color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'default'}
                        sx={{ minWidth: 32, height: 24 }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={product.name}
                      secondary={`${product.sales} penjualan`}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                      secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                    />
                    <Chip
                      label={`${Math.floor((product.sales / topProducts[0].sales) * 100)}%`}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </ListItem>
                  {index < topProducts.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
