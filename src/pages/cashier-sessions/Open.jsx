import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { useSession } from "../../lib/SessionContext";
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
} from "@mui/material";
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";

export default function CashierSessionOpen() {
  const navigate = useNavigate();
  const { refreshSession } = useSession();
  const [shifts, setShifts] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "",
    shift_id: "",
    opening_balance: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);
      const [shiftsRes, cashiersRes] = await Promise.all([
        api.get("/shifts"),
        api.get("/users?role=cashier") // Fetch cashier users
      ]);
      setShifts(shiftsRes.data);
      setCashiers(cashiersRes.data);
      setError("");
    } catch (err) {
      setError("Gagal mengambil data");
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
    
    if (!formData.user_id || !formData.shift_id || !formData.opening_balance) {
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
        user_id: parseInt(formData.user_id),
        shift_id: parseInt(formData.shift_id),
        opening_balance: parseFloat(formData.opening_balance),
      });
      
      // Success notification
      alert("Session kasir berhasil dibuka");
      
      // Reset form
      setFormData({
        user_id: "",
        shift_id: "",
        opening_balance: "",
      });
      
      // Redirect ke halaman history/list setelah berhasil
      navigate("/cashier-sessions", { 
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Buka Session Kasir
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Pilih Kasir</InputLabel>
              <Select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                label="Pilih Kasir"
              >
                {cashiers.map((cashier) => (
                  <MenuItem key={cashier.id} value={cashier.id}>
                    {cashier.name} ({cashier.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Pilih Shift</InputLabel>
              <Select
                name="shift_id"
                value={formData.shift_id}
                onChange={handleChange}
                label="Pilih Shift"
              >
                {shifts.map((shift) => (
                  <MenuItem key={shift.id} value={shift.id}>
                    {shift.name} ({shift.start_time} - {shift.end_time})
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
              placeholder="Masukkan saldo pembukaan"
              inputProps={{ step: "0.01", min: "0" }}
              required
            />

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/cashier-sessions")}
              >
                Batal
              </Button>
              <Button
                variant="contained"
                type="submit"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? "Membuka..." : "Buka Session"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
