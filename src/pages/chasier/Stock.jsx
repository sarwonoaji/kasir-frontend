import { useEffect, useState, useCallback, useRef } from "react";
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
  TablePagination,
  CircularProgress,
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);

  // Debounce ref for search
  const searchTimeoutRef = useRef(null);

  const loadProducts = async (pageNum = 0, limit = 10, search = "", isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearchLoading(true);
      }
      
      const params = {
        page: pageNum + 1, // API menggunakan 1-based indexing
        per_page: limit,
      };

      if (search) {
        params.search = search;
      }

      const res = await api.get("/products", { params });
      setProducts(res.data.data || res.data);
      setTotalItems(res.data.total || res.data.length);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Gagal memuat data produk");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    loadProducts(newPage, rowsPerPage, searchQuery);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    loadProducts(0, newRowsPerPage, searchQuery);
  };

  // Debounced search function
  const debouncedSearch = useCallback((searchTerm) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setPage(0); // Reset to first page when searching
      loadProducts(0, rowsPerPage, searchTerm);
    }, 300); // Wait 300ms after user stops typing
  }, [rowsPerPage]);

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchQuery(newSearchTerm);
    debouncedSearch(newSearchTerm);
  };

  useEffect(() => {
    loadProducts(0, rowsPerPage, searchQuery, true);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
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
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchLoading ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null,
          }}
          sx={{ maxWidth: 500 }}
        />
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
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      {searchQuery.trim() ? `Tidak ada produk yang cocok dengan "${searchQuery}"` : "Tidak ada data produk"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
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
        <TablePagination
          component="div"
          count={totalItems}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Baris per halaman:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} dari ${count}`}
        />
      </Paper>
    </Container>
  );
}