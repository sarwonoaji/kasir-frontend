import { useState, useEffect } from "react";
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
    // setDate("");
    // setRemark("");
    // setItems([]);
    navigate("/product-in");
  };

  return (
    <div>
      <h2>Barang Masuk</h2>

      <form onSubmit={submit}>
        <div>
          <label>Tanggal</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Catatan</label>
          <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </div>

        <hr />

        <h4>Detail Barang</h4>

        {items.map((item, index) => (
          <div key={index} style={{ display: "flex", gap: 8 }}>
            <select
              value={item.product_id}
              onChange={(e) =>
                handleProductChange(index, e.target.value)
              }
              required
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
            />

         <input
            type="number"
            min="0"
            value={item.price}
            readOnly
            />

            <span>
              Total: {item.quantity * item.price}
            </span>

            <button type="button" onClick={() => removeItem(index)}>
              ❌
            </button>
          </div>
        ))}

        <button type="button" onClick={addItem}>
          ➕ Tambah Barang
        </button>

        <hr />

        <button type="submit">💾 Simpan</button>
      </form>
    </div>
  );
}
