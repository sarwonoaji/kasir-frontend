import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../lib/axios";

export default function ProductInShow() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/product-ins/${id}`)
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

  // 🔥 OPSI 1 — PRINT PDF VIA AXIOS (AMAN)
  const printPdf = async () => {
    const res = await api.get(
      `/product-ins/${id}/print`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );

    window.open(url);
  };

  return (
    <div>
      <h2>Detail Barang Masuk</h2>

      <p><b>No Transaksi:</b> {data.no_transaksi}</p>
      <p><b>Tanggal:</b> {data.date}</p>
      <p><b>Catatan:</b> {data.remark || "-"}</p>

      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>No</th>
            <th>Produk</th>
            <th>Qty</th>
            <th>Harga</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.details.map((d, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{d.product?.name}</td>
              <td align="center">{d.quantity}</td>
              <td align="right">
                Rp {Number(d.price).toLocaleString("id-ID")}
              </td>
              <td align="right">
                Rp {Number(d.total_price).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="2">TOTAL</th>
            <th>{totalQty}</th>
            <th></th>
            <th>Rp {totalValue.toLocaleString("id-ID")}</th>
          </tr>
        </tfoot>
      </table>

      <br />

      <button onClick={printPdf}>🖨 Print PDF</button>
      <br /><br />
      <Link to="/products-in">⬅ Kembali</Link>
    </div>
  );
}
