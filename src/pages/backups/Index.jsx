import { useEffect, useState } from "react";
import api from "../../lib/axios";
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Backup as BackupIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";

export default function BackupIndex() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, filename: null });
  const [successMessage, setSuccessMessage] = useState("");
  const [processingMessage, setProcessingMessage] = useState("");

  const loadBackups = async () => {
    try {
      setLoading(true);
      const res = await api.get("/backups");
      setBackups(res.data);
    } catch (err) {
      console.error("Error loading backups:", err);
      setError("Gagal memuat data backup");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setCreating(true);
      setError(""); // Clear any previous errors
      setProcessingMessage("Memproses backup database...");

      console.log("Starting backup creation...");
      const res = await api.post("/backups");
      console.log("Backup creation response:", res);

      setProcessingMessage("Backup berhasil diproses, menunggu file tersimpan...");

      if (res.data.message) {
        console.log("Backup message:", res.data.message);
        setSuccessMessage("Backup database berhasil dibuat! File backup akan muncul dalam beberapa detik.");
        setTimeout(() => setSuccessMessage(""), 8000); // Clear success message after 8 seconds (longer for job processing)
      }

      // Wait a moment for the backup job to complete and file to be written
      setTimeout(async () => {
        console.log("Reloading backups after creation...");
        await loadBackups();
        setCreating(false); // Move this here so loading stays until reload is complete
        setProcessingMessage(""); // Clear processing message
      }, 3000); // Increased to 3 seconds for job processing

    } catch (err) {
      console.error("Error creating backup:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);

      let errorMessage = "Gagal membuat backup";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 403) {
        errorMessage = "Anda tidak memiliki izin untuk membuat backup";
      } else if (err.response?.status === 500) {
        errorMessage = "Terjadi kesalahan server saat membuat backup. Periksa konfigurasi job dan storage.";
      } else if (!err.response) {
        errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet.";
      }

      setError(errorMessage);
      setCreating(false);
      setProcessingMessage(""); // Clear processing message on error
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await api.get(`/backups/${filename}`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading backup:", err);
      setError("Gagal mengunduh backup");
    }
  };

  const handleDeleteClick = (filename) => {
    setDeleteDialog({ open: true, filename });
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/backups/${deleteDialog.filename}`);
      setDeleteDialog({ open: false, filename: null });
      // Reload backups after deletion
      await loadBackups();
    } catch (err) {
      console.error("Error deleting backup:", err);
      setError("Gagal menghapus backup");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, filename: null });
  };

  useEffect(() => {
    loadBackups();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <BackupIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          Manajemen Backup Database
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Kelola backup database sistem
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={creating ? <CircularProgress size={20} /> : <AddIcon />}
          onClick={handleCreateBackup}
          disabled={creating}
          sx={{ px: 3, py: 1.5 }}
        >
          {creating ? "Membuat Backup..." : "Buat Backup Baru"}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {processingMessage && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {processingMessage}
        </Alert>
      )}

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Nama File</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Ukuran</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Tanggal Dibuat</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {backups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      Belum ada backup database
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                backups.map((backup) => (
                  <TableRow key={backup.filename} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                    <TableCell sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>
                      {backup.filename}
                    </TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>{backup.date}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Tooltip title="Unduh Backup">
                        <IconButton
                          color="primary"
                          onClick={() => handleDownload(backup.filename)}
                          sx={{ mr: 1 }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hapus Backup">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(backup.filename)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Konfirmasi Hapus Backup</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus backup "{deleteDialog.filename}"?
            Tindakan ini tidak dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Batal
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}