import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import api from "../../lib/axios";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
  Grid,
} from "@mui/material";
import { Save as SaveIcon, Add as AddIcon } from "@mui/icons-material";

const Receipt = React.forwardRef(({ validItems, total, discount, totalBayar, returnAmount, customerName, casher, paymentMethod, moneyReceived }, ref) => (
  <div ref={ref} style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '300px', margin: '0 auto' }}>
    <h2 style={{ textAlign: 'center' }}>Struk Transaksi</h2>
    <p><strong>Tanggal:</strong> {new Date().toLocaleDateString()}</p>
    <p><strong>Kasir:</strong> {casher}</p>
    <p><strong>Customer:</strong> {customerName || 'Umum'}</p>
    <hr />
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left' }}>Item</th>
          <th style={{ textAlign: 'right' }}>Qty</th>
          <th style={{ textAlign: 'right' }}>Harga</th>
          <th style={{ textAlign: 'right' }}>Disc</th>
          <th style={{ textAlign: 'right' }}>Total</th>
        </tr>
      </thead>
      <tbody>
        {validItems.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td style={{ textAlign: 'right' }}>{item.quantity}</td>
            <td style={{ textAlign: 'right' }}>Rp {item.price.toLocaleString()}</td>
            <td style={{ textAlign: 'right' }}>Rp {item.discount.toLocaleString()}</td>
            <td style={{ textAlign: 'right' }}>Rp {item.total_price.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <hr />
    <p><strong>Total:</strong> Rp {total.toLocaleString()}</p>
    <p><strong>Discount:</strong> Rp {discount.toLocaleString()}</p>
    <p><strong>Total Bayar:</strong> Rp {totalBayar.toLocaleString()}</p>
    <p><strong>Diterima:</strong> Rp {moneyReceived.toLocaleString()}</p>
    <p><strong>Kembali:</strong> Rp {returnAmount.toLocaleString()}</p>
    <p><strong>Pembayaran:</strong> {paymentMethod}</p>
    <hr />
    <p style={{ textAlign: 'center' }}>Terima Kasih!</p>
  </div>
));

export default function ProductOutCreate() {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([
    { barcode: "", product_id: "", name: "", stock: 0, quantity: 1, price: 0, discount: 0, total_price: 0 }
  ]);
  const [customerName, setCustomerName] = useState("");
  const [casher, setCasher] = useState("Admin");
  const [moneyReceived, setMoneyReceived] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState([""]);

  const barcodeRefs = useRef([]);
  const receiptRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
  });

  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "barcode") {
      const product = products.find(p => p.barcode === value);
      if (product) {
        // Cek apakah barcode sudah ada di items lain (exclude current index)
        const existingIndex = items.findIndex((item, i) => i !== index && item.barcode === value);
        if (existingIndex !== -1) {
          // Tambah quantity di existing item
          newItems[existingIndex].quantity += 1;
          newItems[existingIndex].total_price = newItems[existingIndex].price * newItems[existingIndex].quantity;
          
          // Reset current item
          newItems[index] = { barcode: "", product_id: "", name: "", stock: 0, quantity: 1, price: 0, discount: 0, total_price: 0 };
          
          // Clear error
          const newErrors = [...errors];
          newErrors[index] = "";
          setErrors(newErrors);
          
          // Fokus kembali ke current input
          setTimeout(() => barcodeRefs.current[index]?.focus(), 0);
        } else {
          // Update current item
          newItems[index].product_id = product.id;
          newItems[index].name = product.name;
          newItems[index].stock = product.stock;
          newItems[index].price = product.price;
          newItems[index].discount = 0;
          newItems[index].total_price = product.price * newItems[index].quantity;
          
          // Clear error untuk index ini
          const newErrors = [...errors];
          newErrors[index] = "";
          setErrors(newErrors);
          
          // Jika ini row terakhir dan barcode valid, tambah row baru
          if (index === newItems.length - 1) {
            newItems.push({ barcode: "", product_id: "", name: "", stock: 0, quantity: 1, price: 0, discount: 0, total_price: 0 });
            newErrors.push(""); // Tambah error kosong untuk row baru
            setErrors(newErrors);
            // Fokus ke input barcode di baris baru
            setTimeout(() => barcodeRefs.current[newItems.length - 1]?.focus(), 0);
          }
        }
      } else {
        // Reset jika barcode tidak ditemukan
        newItems[index].product_id = "";
        newItems[index].name = "";
        newItems[index].stock = 0;
        newItems[index].price = 0;
        newItems[index].discount = 0;
        newItems[index].total_price = 0;
        
        // Set error jika barcode tidak kosong tapi tidak ditemukan
        const newErrors = [...errors];
        if (value.trim() !== "") {
          newErrors[index] = "Barcode tidak ditemukan";
        } else {
          newErrors[index] = "";
        }
        setErrors(newErrors);
      }
    }

    if (field === "quantity") {
      newItems[index].total_price = (newItems[index].price * value) - newItems[index].discount;
    }

    if (field === "discount") {
      newItems[index].total_price = (newItems[index].price * newItems[index].quantity) - value;
    }

    setItems(newItems);
  };

  // Filter items yang valid (barcode tidak kosong)
  const validItems = items.filter(item => item.barcode !== "");

  const total = validItems.reduce((sum, item) => sum + Number(item.total_price), 0);
  const totalBayar = total - discount;
  const returnAmount = moneyReceived - totalBayar;

  const submit = async () => {
    // Cek jika ada error barcode
    const hasErrors = errors.some(error => error !== "");
    if (hasErrors) {
      alert("Ada barcode yang tidak valid. Perbaiki sebelum menyimpan.");
      return;
    }

    if (validItems.length === 0) {
      alert("Tidak ada item valid untuk disimpan");
      return;
    }
    await api.post("/product-outs", {
      customer_name: customerName,
      date: new Date().toISOString().slice(0, 10),
      casher,
      items: validItems,
      money_received: moneyReceived,
      discount: discount,
      return: returnAmount,
      payment_method: paymentMethod,
    });

    alert("Transaksi berhasil");
    // Print receipt otomatis setelah berhasil
    handlePrint();
    
    // Reset form setelah print
    setItems([{ barcode: "", product_id: "", name: "", stock: 0, quantity: 1, price: 0, total_price: 0 }]);
    setCustomerName("");
    setMoneyReceived(0);
    setDiscount(0);
    setPaymentMethod("");
    setErrors([""]); // Reset errors
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }} className="print-receipt">
        <Typography variant="h4" component="h1" gutterBottom color="primary" sx={{ mb: 3 }}>
          POS - Product Out
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Nama Customer"
              variant="outlined"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
          Daftar Produk
        </Typography>

        <TableContainer component={Paper} elevation={1} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Barcode</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nama Produk</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Qty</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Harga</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Discount</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, i) => (
                <TableRow key={i} hover>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Scan/Input Barcode"
                      value={item.barcode}
                      onChange={(e) => updateItem(i, "barcode", e.target.value)}
                      error={!!errors[i]}
                      helperText={errors[i]}
                      autoFocus={i === 0}
                      inputRef={el => barcodeRefs.current[i] = el}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", e.target.value)}
                      disabled={!item.barcode}
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell>Rp {item.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={item.discount}
                      onChange={(e) => updateItem(i, "discount", Number(e.target.value))}
                      disabled={!item.barcode}
                      sx={{ width: 100 }}
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                  <TableCell>Rp {item.total_price.toLocaleString()}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Total: Rp {total.toLocaleString()}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              const newItems = [...items];
              newItems.push({ barcode: "", product_id: "", name: "", stock: 0, quantity: 1, price: 0, total_price: 0 });
              setItems(newItems);
              const newErrors = [...errors];
              newErrors.push("");
              setErrors(newErrors);
            }}
          >
            Tambah Baris
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Discount"
              type="number"
              variant="outlined"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Money Received"
              type="number"
              variant="outlined"
              value={moneyReceived}
              onChange={(e) => setMoneyReceived(Number(e.target.value))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                label="Payment Method"
              >
                <MenuItem value="">
                  <em>Pilih</em>
                </MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Card">Card</MenuItem>
                <MenuItem value="Transfer">Transfer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" color="primary">
            Total Bayar: Rp {totalBayar.toLocaleString()}
          </Typography>
          <Typography variant="h6" color={returnAmount >= 0 ? "success.main" : "error.main"}>
            Return: Rp {returnAmount.toLocaleString()}
          </Typography>
        </Box>

        {returnAmount < 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Uang yang diterima kurang dari total bayar!
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            onClick={submit}
            sx={{ px: 4, py: 1.5 }}
          >
            Simpan Transaksi
          </Button>
        </Box>
      </Paper>
      {/* Komponen Receipt untuk print, disembunyikan di layar */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <Receipt
          ref={receiptRef}
          validItems={validItems}
          total={total}
          discount={discount}
          totalBayar={totalBayar}
          returnAmount={returnAmount}
          customerName={customerName}
          casher={casher}
          paymentMethod={paymentMethod}
          moneyReceived={moneyReceived}
        />
      </div>
    </Container>
  );
}