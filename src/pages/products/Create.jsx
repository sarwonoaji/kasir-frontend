import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";

export default function ProductCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    barcode: "",
    name: "",
    price: "",
    stock: "",
    unit: "",
    description: "",
  });

  const submit = async () => {
    await api.post("/products", {
      barcode: form.barcode,
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      unit: form.unit,
      description: form.description,
    });

    navigate("/products");
  };

  return (
    <div>
      <h2>Tambah Produk</h2>

      <input placeholder="Barcode" onChange={e => setForm({ ...form, barcode: e.target.value })} />
      <input placeholder="Nama" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input type="number" placeholder="Harga" onChange={e => setForm({ ...form, price: e.target.value })} />
      <input type="number" placeholder="Stok" onChange={e => setForm({ ...form, stock: e.target.value })} />
      <input placeholder="Satuan" onChange={e => setForm({ ...form, unit: e.target.value })} />
      <input placeholder="Keterangan" onChange={e => setForm({ ...form, description: e.target.value })} />

      <button onClick={submit}>Simpan</button>
    </div>
  );
}
