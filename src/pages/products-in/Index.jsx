import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

export default function ProductInIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await api.get("/product-ins");
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const remove = async (id) => {
    if (!confirm("Yakin hapus transaksi ini? Stok akan dikurangi!")) return;

    await api.delete(`/product-ins/${id}`);
    fetchData();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Daftar Barang Masuk</h2>

    <Link to="/products-in/create">
        <button>+ Tambah Produk</button>
      </Link>


      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>No</th>
            <th>No Transaksi</th>
            <th>Tanggal</th>
            <th>Catatan</th>
            <th>Total Item</th>
            <th>Total Nilai</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan="7" align="center">
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
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.no_transaksi}</td>
                <td>{row.date}</td>
                <td>{row.remark}</td>
                <td>{totalQty}</td>
                <td>Rp {totalValue.toLocaleString()}</td>
                <td>
                  {/* nanti bisa tambah edit */}
                  <Link to={`/products-in/${row.id}`}>👁 Detail</Link>{" "}
                    |{" "}
                   <Link to={`/products-in/edit/${row.id}`}>Edit</Link>
                    {" | "}
                  <button onClick={() => remove(row.id)}>🗑 Hapus</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
