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
    <div>
      <h2>Edit Produk</h2>

      <input value={form.barcode} disabled />
      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
      <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
      <input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
      <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

      <button onClick={submit}>Update</button>
    </div>
  );
}
