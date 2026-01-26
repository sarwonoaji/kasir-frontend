import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { useSession } from "../../lib/SessionContext";
import { clearSessionData } from "../../lib/auth";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  TextField,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
} from "@mui/material";
import { Close as CloseIcon, History as HistoryIcon } from "@mui/icons-material";

export default function CashierSessionActive() {
  const navigate = useNavigate();
  const { session, refreshSession } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [closingData, setClosingData] = useState({
    closing_balance: "",
    notes: "",
  });
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    fetchActiveSession();
  }, []);

  const fetchActiveSession = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cashier-sessions/current");
      if (!res.data) {
        setError("Tidak ada session aktif. Buka session baru terlebih dahulu.");
      }
    } catch (err) {
      console.error("Error:", err.response);
      const errorMsg = err.response?.data?.message || "Gagal mengambil session aktif";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseClick = () => {
    setOpenDialog(true);
  };

  const handleCloseChange = (e) => {
    const { name, value } = e.target;
    setClosingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmClose = async () => {
    if (!closingData.closing_balance) {
      alert("Saldo penutupan harus diisi");
      return;
    }

    if (parseFloat(closingData.closing_balance) < 0) {
      alert("Saldo penutupan tidak boleh negatif");
      return;
    }

    try {
      setClosing(true);
      await api.post(`/cashier-sessions/${session.id}/close`, {
        closing_balance: parseFloat(closingData.closing_balance),
        notes: closingData.notes,
      });
      
      setOpenDialog(false);
      clearSessionData();
      await refreshSession();
      
      // Redirect ke halaman open session untuk buka session baru atau logout
      setTimeout(() => {
        navigate("/chasier/session/open");
      }, 1500);
    } catch (err) {
      console.error("Full error:", err.response);
      alert(err.response?.data?.message || "Gagal menutup session");
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error || "Tidak ada session aktif"}
        </Alert>
        <Button 
          variant="contained" 
          fullWidth
          onClick={() => navigate("/chasier/session/open")}
        >
          Buka Session Baru
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Session Kasir Aktif
        </Typography>

        <Alert severity="success" sx={{ mb: 3 }}>
          ✓ Session Anda sedang berjalan
        </Alert>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Session ID
                </Typography>
                <Typography variant="h6">
                  #{session.id}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Shift ID
                </Typography>
                <Typography variant="h6">
                  {session.shift_id}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Status
                </Typography>
                <Chip 
                  label="AKTIF" 
                  color="success" 
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Saldo Pembukaan
                </Typography>
                <Typography variant="h6">
                  Rp {session.opening_balance?.toLocaleString('id-ID') || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Dibuka
                </Typography>
                <Typography variant="body2">
                  {new Date(session.opened_at).toLocaleString('id-ID')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            onClick={handleCloseClick}
            fullWidth
          >
            Tutup Session
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/cashier/create")}
            fullWidth
          >
            Kembali
          </Button>
        </Box>
      </Paper>

      {/* Dialog Close Session */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tutup Session Kasir</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Masukkan saldo penutupan dan catatan untuk menutup session ini
          </Alert>

          <TextField
            fullWidth
            label="Saldo Penutupan"
            name="closing_balance"
            type="number"
            value={closingData.closing_balance}
            onChange={handleCloseChange}
            placeholder="0"
            inputProps={{ step: "0.01", min: "0" }}
            sx={{ mb: 2 }}
            autoFocus
          />

          <TextField
            fullWidth
            label="Catatan"
            name="notes"
            value={closingData.notes}
            onChange={handleCloseChange}
            placeholder="Optional"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={closing}>
            Batal
          </Button>
          <Button 
            onClick={handleConfirmClose} 
            variant="contained" 
            color="error"
            disabled={closing}
          >
            {closing ? "Menutup..." : "Tutup Session"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
