import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { useSession } from "../../lib/SessionContext";
import { setSessionData } from "../../lib/auth";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";

export default function CashierSessionOpen() {
  const navigate = useNavigate();
  const { refreshSession } = useSession();
  const [shifts, setShifts] = useState([]);
  const [formData, setFormData] = useState({
    shift_id: "",
    opening_balance: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setInitialLoading(true);
      const res = await api.get("/shifts");
      setShifts(res.data);
      setError("");
    } catch (err) {
      setError("Gagal mengambil data shift");
      console.error(err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.shift_id || !formData.opening_balance) {
      setError("Semua field harus diisi");
      return;
    }

    if (parseFloat(formData.opening_balance) < 0) {
      setError("Saldo pembukaan tidak boleh negatif");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/cashier-sessions/open", {
        shift_id: parseInt(formData.shift_id),
        opening_balance: parseFloat(formData.opening_balance),
      });
      
      // Simpan session data ke localStorage
      if (res.data) {
        const sessionData = {
          id: res.data.id,
          user_id: res.data.user_id,
          shift_id: res.data.shift_id,
          opening_balance: res.data.opening_balance,
          closing_balance: res.data.closing_balance,
          is_open: res.data.is_open || res.data.closing_at === null,
          opened_at: res.data.opened_at,
          closed_at: res.data.closed_at,
        };
        setSessionData(sessionData);
      }
      
      // Refresh session di context agar UI update
      await refreshSession();
      
      // Redirect ke halaman transaksi cashier setelah berhasil
      navigate("/cashier/create", { 
        state: { message: "Session kasir berhasil dibuka" } 
      });
    } catch (err) {
      console.error("Full error:", err.response);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors).flat();
        setError(messages.join(", "));
      } else {
        setError("Gagal membuka session");
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Buka Session Kasir
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">
              ℹ️ Buka session untuk memulai transaksi kasir Anda hari ini
            </Typography>
          </CardContent>
        </Card>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Shift</InputLabel>
            <Select
              name="shift_id"
              value={formData.shift_id}
              onChange={handleChange}
              label="Shift"
            >
              <MenuItem value="">-- Pilih Shift --</MenuItem>
              {shifts.map(shift => (
                <MenuItem key={shift.id} value={shift.id}>
                  {shift.name || `Shift ${shift.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Saldo Pembukaan"
            name="opening_balance"
            type="number"
            value={formData.opening_balance}
            onChange={handleChange}
            placeholder="0"
            inputProps={{ step: "0.01", min: "0" }}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{ flex: 1 }}
            >
              {loading ? "Membuka..." : "Buka Session"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Batal
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
