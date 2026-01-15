import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/axios";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    barcode: "",
    name: "",
    price: "",
    stock: "",
    unit: "",
    description: "",
  });

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setForm(res.data));
  }, [id]);

  const submit = async () => {
    await api.put(`/products/${id}`, {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      unit: form.unit,
      description: form.description,
    });

    navigate("/products");
  };

  return (
    <div style={{ padding: 20, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Edit Produk</h2>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderTop: '4px solid #007bff',
        maxWidth: '600px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
          <input
            value={form.barcode}
            disabled
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f8f9fa' }}
          />
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            value={form.unit}
            onChange={e => setForm({ ...form, unit: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <button
          onClick={submit}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Update
        </button>
      </div>
    </div>
  );
}

