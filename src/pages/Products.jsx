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
    <div style={{ padding: 20, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>📦 Produk</h2>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        borderTop: '4px solid #007bff'
      }}>
        <h3 style={{ marginTop: 0, color: '#007bff' }}>Tambah Produk Baru</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <input
            placeholder="Barcode"
            value={form.barcode}
            onChange={e => setForm({ ...form, barcode: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            placeholder="Nama Produk"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            placeholder="Harga"
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            placeholder="Stok"
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            placeholder="Satuan"
            value={form.unit}
            onChange={e => setForm({ ...form, unit: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            placeholder="Keterangan"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <button
          onClick={submit}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Tambah
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderTop: '4px solid #007bff'
      }}>
        <h3 style={{ marginTop: 0, color: '#007bff' }}>Daftar Produk</h3>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Barcode</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Nama</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Harga</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Stok</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Satuan</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', color: '#333' }}>{p.barcode}</td>
                <td style={{ padding: '10px', color: '#333' }}>{p.name}</td>
                <td style={{ padding: '10px', color: '#333' }}>Rp {p.price}</td>
                <td style={{ padding: '10px', color: '#333' }}>{p.stock}</td>
                <td style={{ padding: '10px', color: '#333' }}>{p.unit}</td>
                <td style={{ padding: '10px', color: '#333' }}>{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
}
