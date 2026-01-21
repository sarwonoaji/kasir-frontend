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
  Divider,
  IconButton,
} from "@mui/material";
import {
  Print as PrintIcon,
  ArrowBack as ArrowBackIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";

export default function ProductInShow() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/product-ins/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="primary">Memuat detail barang masuk...</Typography>
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
          to="/products-in"
          sx={{ mt: 2 }}
        >
          Kembali ke Daftar Barang Masuk
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
      `/product-ins/${id}/print`,
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
        <IconButton component={Link} to="/products-in" color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          Detail Barang Masuk
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
                  No Transaksi:
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="primary">
                  {data.no_transaksi}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Tanggal: {data.date}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotesIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Catatan: {data.remark || "-"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <InventoryIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Ringkasan Barang
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Total Item:</Typography>
                <Typography variant="body1" fontWeight="bold" color="primary">
                  {totalQty} item
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Total Nilai:</Typography>
                <Typography variant="body1" fontWeight="bold" color="success.main">
                  Rp {totalValue.toLocaleString("id-ID")}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Products Table */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon color="primary" />
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
          to="/products-in"
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
