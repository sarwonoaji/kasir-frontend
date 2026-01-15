import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";

export default function ProductInCreate() {
  const [date, setDate] = useState("");
  const [remark, setRemark] = useState("");
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      { product_id: "", quantity: 1, price: 0 },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleProductChange = (index, productId) => {
    const product = products.find(
      (p) => p.id === Number(productId)
    );

    const newItems = [...items];
    newItems[index].product_id = productId;
    newItems[index].price = product ? product.price : 0;

    setItems(newItems);
  };

  const submit = async (e) => {
    e.preventDefault();

    await api.post("/product-ins", {
      date,
      remark,
      items,
    });

    alert("Product in berhasil disimpan");
    setDate("");
    setRemark("");
    setItems([]);
    navigate("/products-in");
  };

  return (
    <div style={{ padding: 20, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>📥 Barang Masuk</h2>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderTop: '4px solid #007bff',
        maxWidth: '800px'
      }}>
        <form onSubmit={submit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Tanggal</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Catatan</label>
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
            />
          </div>

          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

          <h4 style={{ color: '#007bff', marginBottom: '15px' }}>Detail Barang</h4>

          {items.map((item, index) => (
            <div key={index} style={{
              display: "flex",
              gap: 8,
              alignItems: 'center',
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px'
            }}>
              <select
                value={item.product_id}
                onChange={(e) =>
                  handleProductChange(index, e.target.value)
                }
                required
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 2 }}
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
                onChange={(e) =>
                  updateItem(index, "quantity", Number(e.target.value))
                }
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '80px' }}
              />

              <input
                type="number"
                min="0"
                value={item.price}
                readOnly
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100px', backgroundColor: '#f8f9fa' }}
              />

              <span style={{ flex: 1, fontWeight: 'bold', color: '#007bff' }}>
                Total: Rp {(item.quantity * item.price).toLocaleString()}
              </span>

              <button
                type="button"
                onClick={() => removeItem(index)}
                style={{
                  padding: '8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ❌
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ➕ Tambah Barang
          </button>

          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            💾 Simpan
          </button>
        </form>
      </div>
    </div>
  );
}

