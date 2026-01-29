import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  CircularProgress,
} from "@mui/material";
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  CalendarToday as CalendarIcon,
  Notes as NotesIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

export default function ProductInEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [remark, setRemark] = useState("");
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [productsRes, productInRes] = await Promise.all([
        api.get("/products"),
        api.get(`/product-ins/${id}`),
      ]);

      setProducts(productsRes.data);

      const data = productInRes.data;
      setDate(data.date);
      setRemark(data.remark);

      setItems(
        data.details.map((d) => ({
          product_id: d.product_id,
          quantity: d.quantity,
          price: d.price,
        }))
      );

      setLoading(false);
    };

    fetchAll();
  }, [id]);

  const addItem = () => {
    setItems([
      ...items,
      { product_id: "", quantity: 1, price: 0 },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
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

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const submit = async (e) => {
    e.preventDefault();

    await api.put(`/product-ins/${id}`, {
      date,
      remark,
      items,
    });

    alert("Product in berhasil diupdate");
    navigate("/products-in");
  };

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="primary">Memuat data...</Typography>
      </Box>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <EditIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          Edit Barang Masuk
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 800 }}>
        <Box component="form" onSubmit={submit}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
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
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
                  <Grid item xs={12} md={4}>
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

                  <Grid item xs={12} md={2}>
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

                  <Grid item xs={12} md={2}>
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

                  <Grid item xs={12} md={3}>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      Total: Rp {(item.quantity * item.price).toLocaleString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={1}>
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
            >
              Update
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
