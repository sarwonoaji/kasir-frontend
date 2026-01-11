import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

export default function ProductOutIndex() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/product-outs").then(res => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Daftar Penjualan</h1>

     <Link to="/products-out/create">
            <button>+ Tambah Produk</button>
          </Link>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Invoice</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Kasir</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.invoice}</td>
              <td>{row.customer_name}</td>
              <td>Rp {row.total.toLocaleString()}</td>
              <td>{row.casher}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
