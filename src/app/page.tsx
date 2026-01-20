import { TrendingUp, ShoppingBag, DollarSign, Package } from "lucide-react";

export default function Dashboard() {
  return (
    <div>
      <h1 className="heading-xl">Genel Bakış</h1>

      <div className="stats-grid">
        <div className="glass glass-card stat-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Bugünkü Satış</span>
            <TrendingUp size={20} color="var(--primary)" />
          </div>
          <p className="stat-value">₺12,450.00</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--success)' }}>+12% dünden itibaren</p>
        </div>

        <div className="glass glass-card stat-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Toplam Sipariş</span>
            <ShoppingBag size={20} color="var(--primary)" />
          </div>
          <p className="stat-value">42</p>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>Son 24 saat</p>
        </div>

        <div className="glass glass-card stat-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Net Kâr</span>
            <DollarSign size={20} color="var(--primary)" />
          </div>
          <p className="stat-value">₺4,120.00</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--success)' }}>%33.1 Marj</p>
        </div>

        <div className="glass glass-card stat-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Düşük Stok</span>
            <Package size={20} color="var(--error)" />
          </div>
          <p className="stat-value">8 Ürün</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--error)' }}>Kritik Seviye</p>
        </div>
      </div>

      <div className="glass glass-card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Son Siparişler</h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sipariş No</th>
                <th>Müşteri</th>
                <th>Tutar</th>
                <th>Durum</th>
                <th>Kâr</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: '#TG1045', customer: 'Orçun Aydın', total: '₺2,450.00', status: 'Hazırlanıyor', profit: '₺850.00' },
                { id: '#TG1044', customer: 'Ayşe Yılmaz', total: '₺1,120.00', status: 'Kargolandı', profit: '₺420.00' },
                { id: '#TG1043', customer: 'Mehmet Demir', total: '₺3,200.00', status: 'Tamamlandı', profit: '₺1,100.00' },
              ].map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.total}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: 'rgba(201, 168, 106, 0.1)',
                      color: 'var(--primary)',
                      fontSize: '0.8rem'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--success)' }}>{order.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
