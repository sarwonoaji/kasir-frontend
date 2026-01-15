import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

export default function ProductOutIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await api.get("/product-outs");
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const remove = async (id) => {
    if (!confirm("Yakin hapus transaksi ini?")) return;

    await api.delete(`/product-outs/${id}`);
    fetchData();
  };

  if (loading) return (
    <div style={{ padding: 20, backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p style={{ fontSize: '18px', color: '#007bff' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ padding: 20, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>📤 Daftar Penjualan</h2>

      <Link to="/products-out/create">
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}>
          + Tambah Penjualan
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
              <th style={{ padding: '10px', textAlign: 'left' }}>No</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Invoice</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Customer</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Total</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Kasir</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  Tidak ada data
                </td>
              </tr>
            )}

            {data.map((row, index) => {
              const totalQty = row.details.reduce(
                (sum, d) => sum + Number(d.quantity),
                0
              );

              const totalValue = row.details.reduce(
                (sum, d) => sum + Number(d.total_price),
                0
              );

              return (
                <tr key={row.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', color: '#333' }}>{index + 1}</td>
                  <td style={{ padding: '10px', color: '#333' }}>{row.invoice}</td>
                  <td style={{ padding: '10px', color: '#333' }}>{row.customer_name}</td>
                  <td style={{ padding: '10px', color: '#333' }}>Rp {totalValue.toLocaleString()}</td>
                  <td style={{ padding: '10px', color: '#333' }}>{row.casher}</td>
                  <td style={{ padding: '10px' }}>
                    <Link to={`/products-out/${row.id}`} style={{ color: '#007bff', textDecoration: 'none', marginRight: '10px' }}>👁 Detail</Link>
                    <Link to={`/products-out/edit/${row.id}`} style={{ color: '#007bff', textDecoration: 'none', marginRight: '10px' }}>✏️ Edit</Link>
                    <button
                      onClick={() => remove(row.id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑 Hapus
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
