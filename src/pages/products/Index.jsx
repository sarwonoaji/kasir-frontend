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
    <div style={{ padding: 20, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>📦 Produk</h2>

      <Link to="/products/create">
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}>
          + Tambah Produk
        </button>
      </Link>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderTop: '4px solid #007bff'
      }}>
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
              <th style={{ padding: '10px', textAlign: 'left' }}>Aksi</th>
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
                <td style={{ padding: '10px' }}>
                  <Link to={`/products/edit/${p.id}`} style={{ color: '#007bff', textDecoration: 'none', marginRight: '10px' }}>Edit</Link>
                  <button
                    onClick={() => remove(p.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

