import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/axios";

export default function ProductOutEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [productsRes, productOutRes] = await Promise.all([
        api.get("/products"),
        api.get(`/product-outs/${id}`),
      ]);

      setProducts(productsRes.data);

      const data = productOutRes.data;
      setDate(data.date);
      setCustomer(data.customer_name || "");

      setItems(
        data.details.map((d) => ({
          product_id: d.product_id,
          quantity: d.quantity,
          price: d.price,
        }))
      );

      setLoading(false);
    };

    fetchAll();
  }, [id]);

  const addItem = () => {
    setItems([
      ...items,
      { product_id: "", quantity: 1, price: 0 },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleProductChange = (index, productId) => {
    const product = products.find((p) => p.id === Number(productId));
    const newItems = [...items];
    newItems[index].product_id = productId;
    newItems[index].price = product ? product.price : 0;
    setItems(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const submit = async (e) => {
    e.preventDefault();

    await api.put(`/product-outs/${id}`, {
      date,
      customer_name: customer,
      items,
    });

    alert("Product out berhasil diupdate");
    navigate("/products-out");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', border: '1px solid #007bff', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Edit Penjualan</h2>

        <form onSubmit={submit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tanggal</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ border: '1px solid #007bff', padding: '8px', borderRadius: '4px', width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Customer</label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              style={{ border: '1px solid #007bff', padding: '8px', borderRadius: '4px', width: '100%' }}
            />
          </div>

          <hr style={{ margin: '20px 0' }} />

          <h4 style={{ color: '#007bff', marginBottom: '15px' }}>Detail Barang</h4>

          {items.map((item, index) => (
            <div key={index} style={{ display: "flex", gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
              <select
                value={item.product_id}
                onChange={(e) => handleProductChange(index, e.target.value)}
                required
                style={{ border: '1px solid #007bff', padding: '8px', borderRadius: '4px', flex: 1 }}
              >
                <option value="">-- pilih produk --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                style={{ border: '1px solid #007bff', padding: '8px', borderRadius: '4px', width: '80px' }}
              />

              <input
                type="number"
                min="0"
                value={item.price}
                readOnly
                style={{ border: '1px solid #007bff', padding: '8px', borderRadius: '4px', width: '100px' }}
              />

              <span style={{ fontWeight: 'bold' }}>
                Total: {item.quantity * item.price}
              </span>

              <button type="button" onClick={() => removeItem(index)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
                ❌
              </button>
            </div>
          ))}

          <button type="button" onClick={addItem} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
            ➕ Tambah Barang
          </button>

          <hr style={{ margin: '20px 0' }} />

          <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>💾 Update</button>
        </form>
      </div>
    </div>
  );
}
