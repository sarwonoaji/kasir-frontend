import './dashboard.css';

export default function Dashboard() {
  const stats = [
    { title: 'Total Produk', value: '150', icon: '📦', color: '#0b5ed7' },
    { title: 'Produk Masuk Hari Ini', value: '25', icon: '📥', color: '#16a34a' },
    { title: 'Produk Keluar Hari Ini', value: '10', icon: '📤', color: '#d63384' },
    { title: 'Pendapatan Hari Ini', value: 'Rp 2.500.000', icon: '💰', color: '#f59e0b' },
  ];

  const activities = [
    'Produk "Beras 5kg" ditambahkan',
    'Penjualan produk "Minyak Goreng" sebanyak 5 unit',
    'Stok "Gula 1kg" diperbarui',
    'Produk "Teh Celup" masuk 20 dus'
  ];

  const topProducts = [
    'Beras 5kg - 50 penjualan',
    'Minyak Goreng 2L - 30 penjualan',
    'Gula 1kg - 25 penjualan',
    'Teh Celup - 20 penjualan'
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard Kasir</h2>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="card" key={i}>
            <div className="card-top">
              <div className="icon" style={{ backgroundColor: s.color }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <p className="card-title">{s.title}</p>
                <div className="card-value" style={{ color: s.color }}>{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-grid">
        <div className="section">
          <h3>Aktivitas Terbaru</h3>
          <ul className="activity-list">
            {activities.map((a, i) => (
              <li key={i}>
                <span>{a}</span>
                <span className="small-muted">2 jam lalu</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3>Produk Terlaris</h3>
          <ul className="top-list">
            {topProducts.map((p, i) => (
              <li key={i}>
                <span>{i + 1}. {p}</span>
                <span className="small-muted">{Math.floor(Math.random() * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
