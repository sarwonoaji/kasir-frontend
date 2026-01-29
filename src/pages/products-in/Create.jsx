import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Alert,
} from "@mui/material";
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  CalendarToday as CalendarIcon,
  Notes as NotesIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

export default function ProductInCreate() {
  const [date, setDate] = useState("");
  const [remark, setRemark] = useState("");
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      { product_id: "", quantity: 1, price: 0 },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleProductChange = (index, productId) => {
    const product = products.find(
      (p) => p.id === Number(productId)
    );

    const newItems = [...items];
    newItems[index].product_id = productId;
    newItems[index].price = product ? product.price : 0;

    setItems(newItems);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError("");

    try {
      await api.post("/product-ins", {
        date,
        remark,
        items,
      });

      alert("Product in berhasil disimpan");
      setDate("");
      setRemark("");
      setItems([]);
      navigate("/products-in");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.data && error.response.data.message) {
        setGeneralError(error.response.data.message);
      } else {
        setGeneralError("Terjadi kesalahan saat menyimpan data");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <InventoryIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          Barang Masuk
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 800 }}>
        {generalError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {generalError}
          </Alert>
        )}
        <Box component="form" onSubmit={submit}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarIcon color="action" />
                <Typography variant="body1" fontWeight="medium">
                  Tanggal
                </Typography>
              </Box>
              <TextField
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                fullWidth
                variant="outlined"
                error={!!errors.date}
                helperText={errors.date ? errors.date[0] : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <NotesIcon color="action" />
                <Typography variant="body1" fontWeight="medium">
                  Catatan
                </Typography>
              </Box>
              <TextField
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Masukkan catatan (opsional)"
                error={!!errors.remark}
                helperText={errors.remark ? errors.remark[0] : ""}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <InventoryIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Detail Barang
            </Typography>
          </Box>

          {items.map((item, index) => (
            <Card key={index} elevation={1} sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent sx={{ pb: '16px !important' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControl fullWidth variant="outlined" size="small">
                      <InputLabel>Pilih Produk</InputLabel>
                      <Select
                        value={item.product_id}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                        label="Pilih Produk"
                        required
                      >
                        <MenuItem value="">
                          <em>-- pilih produk --</em>
                        </MenuItem>
                        {products.map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            {p.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      type="number"
                      label="Qty"
                      size="small"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                      inputProps={{ min: 1 }}
                      fullWidth
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      type="number"
                      label="Harga"
                      size="small"
                      value={item.price}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      sx={{ backgroundColor: 'action.hover' }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      Total: Rp {(item.quantity * item.price).toLocaleString()}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 1 }}>
                    <IconButton
                      onClick={() => removeItem(index)}
                      color="error"
                      size="small"
                      sx={{ ml: 'auto', display: 'block' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button
              variant="outlined"
              color="success"
              startIcon={<AddIcon />}
              onClick={addItem}
              size="large"
              sx={{ px: 4 }}
            >
              Tambah Barang
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ArrowBackIcon />}
              size="large"
              sx={{ px: 4, py: 1.5 }}
              onClick={() => navigate('/products-in')}
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
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

