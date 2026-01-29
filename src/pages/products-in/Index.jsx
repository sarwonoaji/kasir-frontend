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
  Inventory as InventoryIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

export default function ProductInIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const res = await api.get("/product-ins");
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const remove = async (id) => {
    if (!confirm("Yakin hapus transaksi ini? Stok akan dikurangi!")) return;

    await api.delete(`/product-ins/${id}`);
    fetchData();
  };

  // Filter data based on search term
  const filteredData = data.filter(item =>
    item.no_transaksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.remark && item.remark.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <InventoryIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
            Daftar Barang Masuk
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
          to="/products-in/create"
          sx={{ px: 3, py: 1.5 }}
        >
          Tambah Barang Masuk
        </Button>
        <TextField
          label="Cari Transaksi"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari berdasarkan no transaksi atau catatan..."
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
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>No Transaksi</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Tanggal</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Catatan</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>Total Item</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'right' }}>Total Nilai</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      {searchTerm ? 'Tidak ada transaksi yang cocok dengan pencarian' : 'Tidak ada data barang masuk'}
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
                      <TableCell sx={{ fontWeight: 'medium', color: 'primary.main' }}>{row.no_transaksi}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.remark || '-'}</TableCell>
                      <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>{totalQty}</TableCell>
                      <TableCell sx={{ textAlign: 'right', fontWeight: 'bold', color: 'success.main' }}>
                        Rp {totalValue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Lihat Detail">
                            <IconButton
                              component={Link}
                              to={`/products-in/${row.id}`}
                              color="primary"
                              size="small"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              component={Link}
                              to={`/products-in/edit/${row.id}`}
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

