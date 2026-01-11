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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">POS - Product Out</h1>

      <input
        className="border p-2 mb-3 w-full"
        placeholder="Nama Customer"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      <table className="w-full border mb-3">
        <thead>
          <tr className="bg-gray-200">
            <th>Produk</th>
            <th>Qty</th>
            <th>Harga</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>
                <select
                  className="border p-1"
                  value={item.product_id}
                  onChange={(e) =>
                    updateItem(i, "product_id", e.target.value)
                  }
                >
                  <option value="">Pilih Produk</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  className="border p-1 w-20"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(i, "quantity", e.target.value)
                  }
                />
              </td>
              <td>{item.price}</td>
              <td>{item.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addItem}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        + Tambah Item
      </button>

      <div className="mt-4 font-bold">
        Total: Rp {total.toLocaleString()}
      </div>

      <button
        onClick={submit}
        className="bg-green-600 text-white px-4 py-2 mt-3 rounded"
      >
        Simpan Transaksi
      </button>
    </div>
  );
}
