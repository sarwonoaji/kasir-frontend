import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

export default function ProductIndex() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const remove = async (id) => {
    if (!confirm("Hapus produk ini?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <h2>📦 Produk</h2>

      <Link to="/products/create">
        <button>+ Tambah Produk</button>
      </Link>

      <table border="1" cellPadding="8" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Barcode</th>
            <th>Nama</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Satuan</th>
            <th>Aksi</th>
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
              <td>
                <Link to={`/products/edit/${p.id}`}>Edit</Link>
                {" | "}
                <button onClick={() => remove(p.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
