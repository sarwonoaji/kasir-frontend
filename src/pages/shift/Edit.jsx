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
    name: "",
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/shifts/${id}`).then(res => {
      setForm(res.data);
      setLoading(false);
    });
  }, [id]);

  const submit = async () => {
    await api.put(`/shifts/${id}`, {
      name: form.name,
      start_time: form.start_time,
      end_time: form.end_time,
    });

    navigate("/shift");
  };

  if (loading) return (
    <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="primary">Memuat data shift...</Typography>
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
                label="Nama Shift"
                variant="outlined"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Masukkan nama shift"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Jam Mulai"
                type="time"
                variant="outlined"
                value={form.start_time}
                onChange={e => setForm({ ...form, start_time: e.target.value })}
                placeholder="00:00"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Jam Selesai"
                type="time"
                variant="outlined"
                value={form.end_time}
                onChange={e => setForm({ ...form, end_time: e.target.value })}
                placeholder="00:00"
                required
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
              onClick={() => navigate('/shift')}
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
              Update Shift
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

