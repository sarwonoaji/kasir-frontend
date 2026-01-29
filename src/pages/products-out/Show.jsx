import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../lib/axios";
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Print as PrintIcon,
  ArrowBack as ArrowBackIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";

export default function ProductOutShow() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/product-outs/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="primary">Memuat detail penjualan...</Typography>
      </Box>
    </Container>
  );

  if (!data) return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Data tidak ditemukan
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/products-out"
          sx={{ mt: 2 }}
        >
          Kembali ke Daftar Penjualan
        </Button>
      </Paper>
    </Container>
  );

  const totalQty = data.details.reduce(
    (sum, d) => sum + Number(d.quantity),
    0
  );

  const totalValue = data.details.reduce(
    (sum, d) => sum + Number(d.total_price),
    0
  );

  const printPdf = async () => {
    const res = await api.get(
      `/product-outs/${id}/print`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );

    window.open(url);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          Detail Penjualan
        </Typography>
      </Box>

      {/* Header Information */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ReceiptIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Informasi Transaksi
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body1" fontWeight="medium" color="text.secondary">
                  Invoice:
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="primary">
                  {data.invoice}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Tanggal: {data.date}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Customer: {data.customer_name || "-"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PaymentIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Ringkasan Pembayaran
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Total:</Typography>
                <Typography variant="body1" fontWeight="bold" color="success.main">
                  Rp {totalValue.toLocaleString("id-ID")}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Uang Diterima:</Typography>
                <Typography variant="body1">
                  Rp {Number(data.money_received || 0).toLocaleString("id-ID")}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Diskon:</Typography>
                <Typography variant="body1">
                  Rp {Number(data.discount || 0).toLocaleString("id-ID")}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Kembalian:</Typography>
                <Typography variant="body1" color={Number(data.return || 0) >= 0 ? "success.main" : "error.main"}>
                  Rp {Number(data.return || 0).toLocaleString("id-ID")}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Metode:</Typography>
                <Chip
                  label={data.payment_method || "Cash"}
                  size="small"
                  color={data.payment_method === 'Card' ? 'primary' : data.payment_method === 'Transfer' ? 'secondary' : 'default'}
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Products Table */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingCartIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Detail Produk ({totalQty} item)
            </Typography>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>No</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Produk</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Qty</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'right' }}>Harga</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'right' }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.details.map((d, i) => (
                <TableRow key={i} hover>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{d.product?.name}</TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 'medium' }}>{d.quantity}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    Rp {Number(d.price).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                    Rp {Number(d.total_price).toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/products-out"
        >
          Kembali ke Daftar
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={printPdf}
          size="large"
        >
          Print PDF
        </Button>
      </Box>
    </Container>
  );
}
