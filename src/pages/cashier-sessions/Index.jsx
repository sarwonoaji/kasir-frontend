import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Alert,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

export default function CashierSessionIndex() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [allSessions, setAllSessions] = useState([]); // Store all data for client-side filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedSession, setSelectedSession] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [closingData, setClosingData] = useState({
    closing_balance: "",
    notes: "",
  });
  const [closing, setClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    // Filter and paginate sessions when search term, page, or rows per page changes
    filterSessions();
  }, [searchTerm, allSessions, page, rowsPerPage]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      // Fetch all data for client-side filtering and pagination
      const res = await api.get("/cashier-sessions/history", {
        params: {
          page: 1,
          per_page: 1000, // Large number to get all data
        }
      });
      
      // Handle berbagai format response
      const data = res.data.data || res.data;
      
      setAllSessions(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Full error:", err.response);
      const errorMsg = err.response?.data?.message || "Gagal mengambil data session";
      setError(errorMsg);
      setAllSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = allSessions;

    if (searchTerm) {
      filtered = allSessions.filter(session =>
        session.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.shift?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply pagination to filtered results
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filtered.slice(startIndex, endIndex);

    setSessions(paginatedData);
    setTotalItems(filtered.length);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetail = (session) => {
    setSelectedSession(session);
    setOpenDetail(true);
  };

  const handleCloseClick = (session) => {
    setSelectedSession(session);
    setClosingData({ closing_balance: "", notes: "" });
    setOpenCloseDialog(true);
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
      await api.post(`/cashier-sessions/${selectedSession.id}/close`, {
        closing_balance: parseFloat(closingData.closing_balance),
        notes: closingData.notes,
      });
      
      setOpenCloseDialog(false);
      setClosingData({ closing_balance: "", notes: "" });
      fetchSessions();
      alert("Session berhasil ditutup");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menutup session");
      console.error(err);
    } finally {
      setClosing(false);
    }
  };

  const getStatusColor = (status) => {
    return status === 'open' ? 'warning' : 'success';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          History Session Kasir
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/cashier-sessions/open')}
        >
          Buka Session Baru
        </Button>
        <TextField
          label="Cari Session"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Cari berdasarkan nama kasir atau shift..."
          sx={{ maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nama Kasir</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Shift</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Dibuka</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Saldo Pembukaan</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography>Tidak ada data session</Typography>
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session, index) => (
                <TableRow key={session.id} hover>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{session.user?.name}</TableCell>
                  <TableCell>{session.shift?.name}</TableCell>
                  <TableCell>
                    {new Date(session.opened_at).toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell>
                    Rp {parseFloat(session.opening_balance).toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={session.status}
                      color={getStatusColor(session.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetail(session)}
                      title="Lihat Detail"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    {session.status === 'open' && (
                      <Button
                        size="small"
                        color="error"
                        startIcon={<CloseIcon />}
                        onClick={() => handleCloseClick(session)}
                        sx={{ ml: 1 }}
                      >
                        Close
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Data per halaman:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`
          }
        />
      </TableContainer>

      {/* Detail Dialog */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon color="primary" />
          Detail Session Kasir
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedSession && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Nama Kasir
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedSession.user?.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary">
                  Shift
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedSession.shift?.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary">
                  Dibuka
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {new Date(selectedSession.opened_at).toLocaleString('id-ID')}
                </Typography>
              </Box>

              {selectedSession.closed_at && (
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Ditutup
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {new Date(selectedSession.closed_at).toLocaleString('id-ID')}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="body2" color="textSecondary">
                  Saldo Pembukaan
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  Rp {parseFloat(selectedSession.opening_balance).toLocaleString('id-ID')}
                </Typography>
              </Box>

              {selectedSession.expected_balance && (
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Expected Balance
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    Rp {parseFloat(selectedSession.expected_balance).toLocaleString('id-ID')}
                  </Typography>
                </Box>
              )}

              {selectedSession.closing_balance && (
                <>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Saldo Penutupan
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      Rp {parseFloat(selectedSession.closing_balance).toLocaleString('id-ID')}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Selisih
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="bold"
                      color={parseFloat(selectedSession.closing_balance) - parseFloat(selectedSession.expected_balance || selectedSession.opening_balance) >= 0 ? 'success.main' : 'error.main'}
                    >
                      Rp {Math.abs(parseFloat(selectedSession.closing_balance) - parseFloat(selectedSession.expected_balance || selectedSession.opening_balance)).toLocaleString('id-ID')}
                    </Typography>
                  </Box>
                </>
              )}

              <Box>
                <Typography variant="body2" color="textSecondary">
                  Status
                </Typography>
                <Chip
                  label={selectedSession.status}
                  color={getStatusColor(selectedSession.status)}
                  sx={{ mt: 0.5 }}
                />
              </Box>

              {selectedSession.notes && (
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Catatan
                  </Typography>
                  <Typography variant="body1">
                    {selectedSession.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Close Session Dialog */}
      <Dialog open={openCloseDialog} onClose={() => setOpenCloseDialog(false)} maxWidth="sm" fullWidth>
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
            onClick={() => setOpenCloseDialog(false)}
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
