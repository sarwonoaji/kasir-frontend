import { useEffect, useState, useCallback, useRef } from "react";
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
  TextField,
  InputAdornment,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

export default function ProductIndex() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

      // Handle response dengan pagination
      if (res.data.data && res.data.total !== undefined) {
        setProducts(res.data.data);
        setTotalItems(res.data.total);
      } else if (Array.isArray(res.data)) {
        // Fallback jika API mengembalikan array langsung
        setProducts(res.data);
        setTotalItems(res.data.length);
      } else {
        setProducts([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Hapus produk ini?")) return;

    try {
      await api.delete(`/products/${id}`);
      // Reload current page after deletion
      loadProducts(page, rowsPerPage, searchTerm);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Gagal menghapus produk");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    loadProducts(newPage, rowsPerPage, searchTerm);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    loadProducts(0, newRowsPerPage, searchTerm);
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
    setSearchTerm(newSearchTerm);
    debouncedSearch(newSearchTerm);
  };

  useEffect(() => {
    loadProducts(0, rowsPerPage, searchTerm, true);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
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
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          component={Link}
          to="/products/create"
          sx={{ px: 3, py: 1.5 }}
        >
          Tambah Produk
        </Button>
        <TextField
          label="Cari Produk"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Cari berdasarkan nama produk atau barcode..."
          sx={{ maxWidth: 400 }}
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
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <CircularProgress size={40} />
                      <Typography variant="body1" color="text.secondary">
                        Memuat data produk...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      {searchTerm ? 'Tidak ada produk yang cocok dengan pencarian' : 'Tidak ada data produk'}
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
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Produk">
                          <IconButton
                            component={Link}
                            to={`/products/edit/${p.id}`}
                            color="secondary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus Produk">
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Data per halaman:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`
          }
        />
      </Paper>
    </Container>
  );
}

