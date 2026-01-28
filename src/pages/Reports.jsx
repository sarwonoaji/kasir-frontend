import React, { useState, useEffect } from "react";
import api from "../lib/axios";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Assessment as ReportIcon } from "@mui/icons-material";

export default function Reports() {
  const [reportType, setReportType] = useState("daily");
  const [shiftId, setShiftId] = useState("");
  const [shifts, setShifts] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin" && role !== "manager") {
      setError("Akses ditolak. Hanya admin yang dapat melihat laporan ini.");
      return;
    }
    if (reportType === "shift") {
      fetchShifts();
    }
  }, [reportType, role]);

  const fetchShifts = async () => {
    try {
      const res = await api.get("/shifts");
      setShifts(res.data);
    } catch (err) {
      console.error("Error fetching shifts:", err);
    }
  };

  const fetchReport = async () => {
    if (role !== "admin" && role !== "manager") {
      setError("Akses ditolak. Hanya admin yang dapat melihat laporan ini.");
      return;
    }

    if (reportType === "shift" && !shiftId) {
      setError("Pilih shift terlebih dahulu");
      return;
    }

    try {
      setLoading(true);
      setError("");
      let endpoint = "";
      if (reportType === "daily") {
        endpoint = "/product-outs/report-all-daily";
      } else if (reportType === "monthly") {
        endpoint = "/product-outs/report-all-monthly";
      } else if (reportType === "shift") {
        endpoint = `/product-outs/report-all-shift/${shiftId}`;
      }

      const res = await api.get(endpoint);
      setReportData(res.data);
    } catch (err) {
      console.error("Error fetching report:", err);
      const errorMsg = err.response?.data?.message || "Gagal mengambil laporan";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    setShiftId("");
    setReportData(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <ReportIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          Laporan Penjualan Semua Kasir
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Pilih Tipe Laporan
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tipe Laporan</InputLabel>
              <Select
                value={reportType}
                label="Tipe Laporan"
                onChange={handleReportTypeChange}
              >
                <MenuItem value="daily">Harian</MenuItem>
                <MenuItem value="monthly">Bulanan</MenuItem>
                <MenuItem value="shift">Berdasarkan Shift</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {reportType === "shift" && (
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Pilih Shift</InputLabel>
                <Select
                  value={shiftId}
                  label="Pilih Shift"
                  onChange={(e) => setShiftId(e.target.value)}
                >
                  {shifts.map((shift) => (
                    <MenuItem key={shift.id} value={shift.id}>
                      {shift.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchReport}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Generate Laporan"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {reportData && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Transaksi
                </Typography>
                <Typography variant="h4" component="div">
                  {reportData.total_transactions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Penjualan
                </Typography>
                <Typography variant="h4" component="div">
                  Rp {reportData.total_sales?.toLocaleString() || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {reportType === "daily" ? "Tanggal" : reportType === "monthly" ? "Bulan/Tahun" : "Shift ID"}
                </Typography>
                <Typography variant="h6" component="div">
                  {reportType === "daily" ? reportData.date :
                   reportType === "monthly" ? `${reportData.month}/${reportData.year}` :
                   reportData.shift_id}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Typography variant="h6" sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                Detail Transaksi
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Invoice</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Tanggal</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Kasir</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Items</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.transactions?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="h6" color="textSecondary">
                            Tidak ada transaksi
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      reportData.transactions?.map((transaction, index) => (
                        <TableRow key={transaction.id} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{transaction.invoice_number || `INV-${transaction.id}`}</TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.customer_name || 'Umum'}</TableCell>
                          <TableCell>{transaction.user?.name || 'N/A'}</TableCell>
                          <TableCell>Rp {transaction.total?.toLocaleString() || 0}</TableCell>
                          <TableCell>
                            {transaction.details?.length || 0} item(s)
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}