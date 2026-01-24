import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../lib/axios";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  TextField,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { Close as CloseIcon, History as HistoryIcon } from "@mui/icons-material";

export default function CashierSessionActive() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");
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
      const res = await api.get("/cashier-sessions/active");
      console.log("Active session response:", res.data);
      if (res.data) {
        setSession(res.data);
        setError("");
      } else {
        setError("Tidak ada session aktif. Buka session baru terlebih dahulu.");
      }
    } catch (err) {
      console.error("Full error:", err.response);
      const errorMsg = err.response?.data?.message || "Gagal mengambil session aktif";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };;

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
      setMessage("Session kasir berhasil ditutup");
      setSession(null);
      setClosingData({ closing_balance: "", notes: "" });
      
      // Redirect ke history setelah 2 detik
      setTimeout(() => {
        navigate("/cashier-sessions");
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menutup session");
      console.error(err);
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Session Kasir Aktif
          </Typography>
          <Button
            variant="contained"
            startIcon={<HistoryIcon />}
            onClick={() => navigate("/cashier-sessions")}
          >
            Lihat History
          </Button>
        </Box>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Tidak ada session kasir yang sedang aktif
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/cashier-sessions/open")}
          >
            Buka Session Baru
          </Button>
        </Paper>
      </Container>
    );
  }

  const difference = session.closing_balance ? 
    (parseFloat(session.closing_balance) - parseFloat(session.opening_balance)) : 0;
  const differenceStatus = difference >= 0 ? "success" : "error";

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Session Kasir Aktif
        </Typography>
        <Button
          variant="contained"
          startIcon={<HistoryIcon />}
          onClick={() => navigate("/cashier-sessions")}
        >
          Lihat History
        </Button>
      </Box>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Informasi Session
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Nama Kasir:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {session.user?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shift:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {session.shift?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Dibuka:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {new Date(session.opened_at).toLocaleString('id-ID')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Status:</Typography>
                  <Chip 
                    label={session.status} 
                    color="success" 
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ringkasan Transaksi
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Saldo Pembukaan:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    Rp {parseFloat(session.opening_balance).toLocaleString('id-ID')}
                  </Typography>
                </Box>
                {session.closing_balance && (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Saldo Penutupan:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        Rp {parseFloat(session.closing_balance).toLocaleString('id-ID')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Selisih:</Typography>
                      <Chip
                        label={`Rp ${Math.abs(difference).toLocaleString('id-ID')}`}
                        color={differenceStatus}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<CloseIcon />}
          onClick={handleCloseClick}
        >
          Tutup Session
        </Button>
      </Box>

      {/* Close Session Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tutup Session Kasir</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Saldo Penutupan"
            name="closing_balance"
            type="number"
            value={closingData.closing_balance}
            onChange={handleCloseChange}
            placeholder="Masukkan saldo penutupan"
            inputProps={{ step: "0.01", min: "0" }}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Catatan (Opsional)"
            name="notes"
            value={closingData.notes}
            onChange={handleCloseChange}
            placeholder="Catatan atau keterangan tambahan"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)}
            disabled={closing}
          >
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
