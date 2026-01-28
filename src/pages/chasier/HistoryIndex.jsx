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
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";

export default function CashierHistoryIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await api.get("/product-outs/transactionToday");
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

 
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
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      Tidak ada data penjualan
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => {
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
                              to={`/cashier/HistoryDetail/${row.id}`}
                              color="primary"
                              size="small"
                            >
                              <VisibilityIcon />
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

