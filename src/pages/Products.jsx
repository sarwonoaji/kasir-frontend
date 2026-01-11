import { useEffect, useState } from "react";
import api from "../lib/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    barcode: "",
    name: "",
    price: "",
    stock: "",
    unit: "",
    description: ""
  });

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const submit = async () => {
    await api.post("/products", {
      barcode: form.barcode,
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      unit: form.unit,
      description: form.description
    });

    setForm({ barcode: "", name: "", price: "", stock: "" , unit: "", description: ""});
    loadProducts();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 Produk</h2>

      <div>
        <input
          placeholder="Barcode"
          value={form.barcode}
          onChange={e => setForm({ ...form, barcode: e.target.value })}
        />
        <input
          placeholder="Nama Produk"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Harga"
          type="number"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Stok"
          type="number"
          value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })}
        />

        <input
          placeholder="Satuan"
          value={form.unit}
          onChange={e => setForm({ ...form, unit: e.target.value })}
        />

        <input
          placeholder="Keterangan"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <button onClick={submit}>Tambah</button>
      </div>

      <hr />

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Barcode</th>
            <th>Nama</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Satuan</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.barcode}</td>
              <td>{p.name}</td>
              <td>Rp {p.price}</td>
              <td>{p.stock}</td>
              <td>{p.unit}</td>
              <td>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
