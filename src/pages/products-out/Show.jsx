import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../lib/axios";

export default function ProductOutShow() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/product-outs/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Data tidak ditemukan</p>;

  const totalQty = data.details.reduce(
    (sum, d) => sum + Number(d.quantity),
    0
  );

  const totalValue = data.details.reduce(
    (sum, d) => sum + Number(d.total_price),
    0
  );

  const printPdf = async () => {
    const res = await api.get(
      `/product-outs/${id}/print`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );

    window.open(url);
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', border: '1px solid #007bff', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Detail Penjualan</h2>

        <p style={{ marginBottom: '10px' }}><b>Invoice:</b> {data.invoice}</p>
        <p style={{ marginBottom: '10px' }}><b>Tanggal:</b> {data.date}</p>
        <p style={{ marginBottom: '20px' }}><b>Customer:</b> {data.customer_name || "-"}</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>No</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Produk</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Harga</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.details.map((d, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{i + 1}</td>
                <td style={{ padding: '10px' }}>{d.product?.name}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{d.quantity}</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>
                  Rp {Number(d.price).toLocaleString("id-ID")}
                </td>
                <td style={{ padding: '10px', textAlign: 'right' }}>
                  Rp {Number(d.total_price).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
              <th colSpan="2" style={{ padding: '10px' }}>TOTAL</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>{totalQty}</th>
              <th style={{ padding: '10px' }}></th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Rp {totalValue.toLocaleString("id-ID")}</th>
            </tr>
            <tr>
              <th colSpan="4" style={{ padding: '10px', textAlign: 'left' }}>Money Received:</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Rp {Number(data.money_received || 0).toLocaleString("id-ID")}</th>
            </tr>
            <tr>
              <th colSpan="4" style={{ padding: '10px', textAlign: 'left' }}>Discount:</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Rp {Number(data.discount || 0).toLocaleString("id-ID")}</th>
            </tr>
            <tr>
              <th colSpan="4" style={{ padding: '10px', textAlign: 'left' }}>Return:</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Rp {Number(data.return || 0).toLocaleString("id-ID")}</th>
            </tr>
            <tr>
              <th colSpan="4" style={{ padding: '10px', textAlign: 'left' }}>Payment Method:</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>{data.payment_method || "-"}</th>
            </tr>
          </tfoot>
        </table>

        <button onClick={printPdf} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>🖨 Print PDF</button>
        <br /><br />
        <Link to="/products-out" style={{ color: '#007bff', textDecoration: 'none' }}>⬅ Kembali</Link>
      </div>
    </div>
  );
}
