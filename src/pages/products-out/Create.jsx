import { useState, useEffect } from "react";
import api from "../../lib/axios";

export default function ProductOutCreate() {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [casher, setCasher] = useState("Admin");

  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      { product_id: "", quantity: 1, price: 0, total_price: 0 },
    ]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "product_id") {
      const product = products.find(p => p.id == value);
      newItems[index].price = product.price;
      newItems[index].total_price =
        product.price * newItems[index].quantity;
    }

    if (field === "quantity") {
      newItems[index].total_price =
        newItems[index].price * value;
    }

    setItems(newItems);
  };

  const total = items.reduce((sum, item) => sum + Number(item.total_price), 0);

  const submit = async () => {
    await api.post("/product-outs", {
      customer_name: customerName,
      date: new Date().toISOString().slice(0, 10),
      casher,
      items,
    });

    alert("Transaksi berhasil");
    setItems([]);
    setCustomerName("");
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', border: '1px solid #007bff', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <h1 style={{ color: '#007bff', marginBottom: '20px' }}>POS - Product Out</h1>

        <input
          placeholder="Nama Customer"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={{ border: '1px solid #007bff', padding: '8px', borderRadius: '4px', width: '100%', marginBottom: '15px' }}
        />

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Produk</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Qty</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Harga</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>
                  <select
                    value={item.product_id}
                    onChange={(e) =>
                      updateItem(i, "product_id", e.target.value)
                    }
                    style={{ border: '1px solid #007bff', padding: '8px', borderRadius: '4px', width: '100%' }}
                  >
                    <option value="">Pilih Produk</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '10px' }}>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(i, "quantity", e.target.value)
                    }
                    style={{ border: '1px solid #007bff', padding: '8px', borderRadius: '4px', width: '80px' }}
                  />
                </td>
                <td style={{ padding: '10px' }}>{item.price}</td>
                <td style={{ padding: '10px' }}>{item.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addItem}
          style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', marginBottom: '15px' }}
        >
          + Tambah Item
        </button>

        <div style={{ fontWeight: 'bold', marginBottom: '15px' }}>
          Total: Rp {total.toLocaleString()}
        </div>

        <button
          onClick={submit}
          style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Simpan Transaksi
        </button>
      </div>
    </div>
  );
}
