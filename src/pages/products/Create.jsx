import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Alert,
} from "@mui/material";
import {
  Save as SaveIcon,
  Inventory as InventoryIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function ProductCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    barcode: "",
    name: "",
    price: "",
    stock: "",
    unit: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const submit = async () => {
    setLoading(true);
    setErrors({});
    setGeneralError("");

    try {
      await api.post("/products", {
        barcode: form.barcode,
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        unit: form.unit,
        description: form.description,
      });

      navigate("/products");
    } catch (error) {
      console.error("Error creating product:", error);

      if (error.response?.data?.errors) {
        // Handle validation errors
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        // Handle general error message
        setGeneralError(error.response.data.message);
      } else {
        // Handle network or other errors
        setGeneralError("Terjadi kesalahan saat menyimpan produk");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <InventoryIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          Tambah Produk
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 600 }}>
        {generalError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {generalError}
          </Alert>
        )}

        <Box component="form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Barcode"
                variant="outlined"
                value={form.barcode}
                onChange={e => setForm({ ...form, barcode: e.target.value })}
                placeholder="Masukkan barcode produk"
                required
                error={!!errors.barcode}
                helperText={errors.barcode ? errors.barcode[0] : ""}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nama Produk"
                variant="outlined"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Masukkan nama produk"
                required
                error={!!errors.name}
                helperText={errors.name ? errors.name[0] : ""}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
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
                error={!!errors.price}
                helperText={errors.price ? errors.price[0] : ""}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Stok"
                type="number"
                variant="outlined"
                value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
                required
                error={!!errors.stock}
                helperText={errors.stock ? errors.stock[0] : ""}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Satuan"
                variant="outlined"
                value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}
                placeholder="pcs, kg, liter, dll"
                required
                error={!!errors.unit}
                helperText={errors.unit ? errors.unit[0] : ""}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Keterangan"
                variant="outlined"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Deskripsi produk (opsional)"
                multiline
                rows={2}
                error={!!errors.description}
                helperText={errors.description ? errors.description[0] : ""}
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
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Produk"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

