import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

export default function ProductOutIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const res = await api.get("/product-outs");
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const remove = async (id) => {
    if (!confirm("Yakin hapus transaksi ini?")) return;

    await api.delete(`/product-outs/${id}`);
    fetchData();
  };

  // Filter data based on search term
  const filteredData = data.filter(item =>
    item.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.customer_name && item.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.casher && item.casher.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="primary">Memuat data...</Typography>
      </Box>
    </Container>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ShoppingCartIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
            Daftar Penjualan
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          component={Link}
          to="/products-out/create"
          sx={{ px: 3, py: 1.5 }}
        >
          Tambah Penjualan
        </Button>
        <TextField
          label="Cari Penjualan"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari berdasarkan invoice, customer, atau kasir..."
          sx={{ maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>No</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Invoice</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Customer</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Total Bayar</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Uang Diterima</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Diskon</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Kembalian</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Metode Pembayaran</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Kasir</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      {searchTerm ? 'Tidak ada penjualan yang cocok dengan pencarian' : 'Tidak ada data penjualan'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, index) => {
                  const totalQty = row.details.reduce(
                    (sum, d) => sum + Number(d.quantity),
                    0
                  );

                  const totalValue = row.details.reduce(
                    (sum, d) => sum + Number(d.total_price),
                    0
                  );

                  return (
                    <TableRow key={row.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                      <TableCell sx={{ fontWeight: 'medium' }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 'medium', color: 'primary.main' }}>{row.invoice}</TableCell>
                      <TableCell>{row.customer_name || '-'}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        Rp {totalValue.toLocaleString()}
                      </TableCell>
                      <TableCell>Rp {Number(row.money_received).toLocaleString()}</TableCell>
                      <TableCell>Rp {Number(row.discount).toLocaleString()}</TableCell>
                      <TableCell sx={{ color: Number(row.return) >= 0 ? 'success.main' : 'error.main' }}>
                        Rp {Number(row.return).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.payment_method || 'Cash'}
                          size="small"
                          color={row.payment_method === 'Card' ? 'primary' : row.payment_method === 'Transfer' ? 'secondary' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{row.casher}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Lihat Detail">
                            <IconButton
                              component={Link}
                              to={`/products-out/${row.id}`}
                              color="primary"
                              size="small"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              component={Link}
                              to={`/products-out/edit/${row.id}`}
                              color="secondary"
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus">
                            <IconButton
                              onClick={() => remove(row.id)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

