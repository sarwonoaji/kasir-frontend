import { useEffect, useState, useMemo } from "react";
import api from "../../lib/axios";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

export default function CashierStock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Gagal memuat data produk");
    } finally {
      setLoading(false);
    }
  };

  // Filter products berdasarkan search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.barcode.toLowerCase().includes(query) ||
      (product.unit && product.unit.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <InventoryIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          Lihat Stock Produk
        </Typography>
      </Box>

      {/* Search Field */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Cari produk berdasarkan nama, barcode, atau satuan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
        {searchQuery.trim() && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Menampilkan {filteredProducts.length} dari {products.length} produk
          </Typography>
        )}
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Barcode</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Nama Produk</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'right' }}>Harga</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>Stok</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Satuan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      {searchQuery.trim() ? `Tidak ada produk yang cocok dengan "${searchQuery}"` : "Tidak ada data produk"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((p) => (
                  <TableRow key={p.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <QrCodeIcon fontSize="small" color="action" />
                        <Typography variant="body2" fontFamily="monospace" fontWeight="medium">
                          {p.barcode}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>{p.name}</TableCell>
                    <TableCell sx={{ textAlign: 'right', fontWeight: 'bold', color: 'success.main' }}>
                      Rp {Number(p.price).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Chip
                        label={p.stock}
                        size="small"
                        color={p.stock > 10 ? 'success' : p.stock > 0 ? 'warning' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{p.unit || '-'}</TableCell>
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