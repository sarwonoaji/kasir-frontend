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
  Box,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
} from "@mui/icons-material";

export default function ShiftIndex() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const res = await api.get("/shifts");
    setProducts(res.data);
  };

  const remove = async (id) => {
    if (!confirm("Hapus shift ini?")) return;
    await api.delete(`/shifts/${id}`);
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <InventoryIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
            Daftar Produk
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          component={Link}
          to="/shift/create"
          sx={{ px: 3, py: 1.5 }}
        >
          Tambah Shift
        </Button>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Nama Shift</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'right' }}>Jam Mulai</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>Jam Selesai</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      Tidak ada data produk
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                    
                    <TableCell sx={{ fontWeight: 'medium' }}>{p.name}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>{p.start_time}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{p.end_time}</TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Shift">
                          <IconButton
                            component={Link}
                            to={`/shift/edit/${p.id}`}
                            color="secondary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus Shift">
                          <IconButton
                            onClick={() => remove(p.id)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

