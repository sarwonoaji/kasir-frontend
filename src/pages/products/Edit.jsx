import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/axios";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Save as SaveIcon,
  Inventory as InventoryIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    barcode: "",
    name: "",
    price: "",
    stock: "",
    unit: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`).then(res => {
      setForm(res.data);
      setLoading(false);
    });
  }, [id]);

  const submit = async () => {
    await api.put(`/products/${id}`, {
      barcode: form.barcode,
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      unit: form.unit,
      description: form.description,
    });

    navigate("/products");
  };

  if (loading) return (
    <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="primary">Memuat data produk...</Typography>
      </Box>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <EditIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          Edit Produk
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 600 }}>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Barcode"
                variant="outlined"
                value={form.barcode}
                onChange={e => setForm({ ...form, barcode: e.target.value })}
                placeholder="Masukkan barcode produk"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nama Produk"
                variant="outlined"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Masukkan nama produk"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Harga"
                type="number"
                variant="outlined"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                placeholder="0"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>Rp</Typography>,
                }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Stok"
                type="number"
                variant="outlined"
                value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Satuan"
                variant="outlined"
                value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}
                placeholder="pcs, kg, liter, dll"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Keterangan"
                variant="outlined"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Deskripsi produk (opsional)"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ArrowBackIcon />}
              size="large"
              sx={{ px: 4, py: 1.5 }}
              onClick={() => navigate('/products')}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              size="large"
              sx={{ px: 6, py: 1.5 }}
            >
              Update Produk
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

