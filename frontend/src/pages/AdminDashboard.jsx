import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { FiDollarSign, FiShoppingBag, FiTrendingUp, FiAlertTriangle } from "react-icons/fi";

function AdminDashboard() {
  const [stats, setStats] = useState({
      revenue: 0,
      orders: 0,
      topProducts: [],
      lowStockCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/stats/summary");
            setStats(res.data);
        } catch (error) {
            console.error(error);
        }
    };
    fetchStats();
  }, []);

  // Card Component for consistency
  const StatCard = ({ title, value, icon: Icon, color }) => (
      <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "15px", display: "flex", alignItems: "center", gap: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", border: "1px solid #E2E8F0" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "12px", backgroundColor: color, display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontSize: "24px", flexShrink: 0 }}>
              <Icon />
          </div>
          <div>
              <div style={{ color: "#718096", fontSize: "14px", fontWeight: "600" }}>{title}</div>
              <div style={{ color: "#2D3748", fontSize: "28px", fontWeight: "bold" }}>{value}</div>
          </div>
      </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)" }}>
      <Sidebar />
      {/* Responsive Wrapper */}
      <div className="dashboard-content">
        <Header />
        
        {/* Responsive Padding */}
        <main className="main-container">
            <h1 style={{ color: "var(--primary-dark)", fontSize: "28px", marginBottom: "30px" }}>
                Business Overview 📊
            </h1>

            {/* STATS GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "25px", marginBottom: "40px" }}>
                <StatCard 
                    title="Total Revenue" 
                    value={`$${stats.revenue.toFixed(2)}`} 
                    icon={FiDollarSign} 
                    color="#48BB78" 
                />
                <StatCard 
                    title="Total Orders" 
                    value={stats.orders} 
                    icon={FiShoppingBag} 
                    color="#4299E1" 
                />
                <StatCard 
                    title="Low Stock Items" 
                    value={stats.lowStockCount} 
                    icon={FiAlertTriangle} 
                    color={stats.lowStockCount > 0 ? "#F56565" : "#ECC94B"} 
                />
            </div>

            {/* TOP PRODUCTS TABLE */}
            <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "15px", border: "1px solid #E2E8F0", overflowX: "auto" }}>
                {/* overflowX allows table scroll on mobile */}
                <h3 style={{ margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "10px", color: "#2D3748" }}>
                    <FiTrendingUp /> Top Selling Products
                </h3>
                
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #E2E8F0", color: "#718096", textAlign: "left" }}>
                            <th style={{ padding: "15px" }}>Product Name</th>
                            <th style={{ padding: "15px" }}>Units Sold</th>
                            <th style={{ padding: "15px" }}>Revenue Generated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.topProducts.map((p, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #EDF2F7" }}>
                                <td style={{ padding: "15px", fontWeight: "bold", color: "#2D3748" }}>
                                    {index + 1}. {p._id}
                                </td>
                                <td style={{ padding: "15px" }}>{p.totalSold}</td>
                                <td style={{ padding: "15px", color: "#48BB78", fontWeight: "bold" }}>
                                    ${p.revenue.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {stats.topProducts.length === 0 && (
                    <div style={{ padding: "20px", textAlign: "center", color: "#A0AEC0" }}>
                        No sales data available yet.
                    </div>
                )}
            </div>

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;