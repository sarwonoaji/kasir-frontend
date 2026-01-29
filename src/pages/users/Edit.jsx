import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/axios";
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

export default function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setInitialLoading(true);
      const res = await api.get(`/users/${id}`);
      setFormData({
        name: res.data.name,
        email: res.data.email,
        password: "",
        role: res.data.role,
      });
      setError("");
    } catch (err) {
      setError("Gagal mengambil data user");
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
    
    // Validasi
    if (!formData.name || !formData.email) {
      setError("Nama dan Email harus diisi");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      // Hanya kirim password jika diisi
      if (formData.password) {
        updateData.password = formData.password;
      }

      await api.put(`/users/${id}`, updateData);
      navigate("/users");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors).flat();
        setError(messages.join(", "));
      } else {
        setError("Gagal mengubah user");
      }
      console.error(err);
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
          Edit User
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
            <TextField
              fullWidth
              label="Nama"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama user"
              required
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              required
            />

            <TextField
              fullWidth
              label="Password Baru (Kosongkan jika tidak ingin mengubah)"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password baru (min. 6 karakter)"
            />

            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="cashier">Cashier</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/users")}
              >
                Batal
              </Button>
              <Button
                variant="contained"
                type="submit"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
