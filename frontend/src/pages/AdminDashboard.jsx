import { useEffect, useState } from "react";
import axios from "axios";
import { FiDollarSign, FiShoppingBag, FiAlertCircle, FiCalendar } from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../context/AuthContext"; // 1. Import Auth Context

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  // Get User Token
  const { user } = useAuth(); // 2. Extract user

  // State for statistics
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    lowStockCount: 0,
    topProducts: []
  });

  // State for Time Filter
  const [timeRange, setTimeRange] = useState("today"); 

  // Fetch stats from API based on selected range
  const fetchStats = async () => {
    // Guard: If no token, don't fetch
    if (!user?.token) return;

    try {
      // 3. Add Authorization Header
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      const res = await axios.get(`http://3.227.144.60:3000/api/stats/summary?range=${timeRange}`, config);
      setStats(res.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Reload data when timeRange OR user changes
  useEffect(() => {
    fetchStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000); 
    return () => clearInterval(interval);
  }, [timeRange, user]); // Added 'user' to dependency array

  // --- CHART CONFIGURATION ---
  const chartData = {
    labels: stats.topProducts.map((p) => p._id), 
    datasets: [
      {
        label: "Units Sold",
        data: stats.topProducts.map((p) => p.totalSold), 
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Best Selling Products (${timeRange.toUpperCase()})` },
    },
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* HEADER & FILTER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
        <div>
            <h1 style={{ margin: 0, color: "#2D3748" }}>Dashboard Overview</h1>
            <p style={{ margin: "5px 0 0 0", color: "#718096" }}>Welcome back, Admin</p>
        </div>

        {/* TIME RANGE SELECTOR */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "white", padding: "10px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
            <FiCalendar color="#4A5568"/>
            <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                style={{ border: "none", outline: "none", fontSize: "14px", color: "#2D3748", fontWeight: "600", cursor: "pointer", background: "transparent" }}
            >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
            </select>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        
        {/* REVENUE */}
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.revenue.toFixed(2)}`} 
          icon={<FiDollarSign size={24} color="#38A169" />} 
          bg="#F0FFF4" 
        />

        {/* ORDERS */}
        <StatCard 
          title="Total Orders" 
          value={stats.orders} 
          icon={<FiShoppingBag size={24} color="#3182CE" />} 
          bg="#EBF8FF" 
        />

        {/* LOW STOCK */}
        <StatCard 
          title="Low Stock Items" 
          value={stats.lowStockCount} 
          icon={<FiAlertCircle size={24} color="#E53E3E" />} 
          bg="#FFF5F5" 
          alert={stats.lowStockCount > 0}
        />
      </div>

      {/* CHART SECTION */}
      <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
         {stats.topProducts.length > 0 ? (
            <Bar options={chartOptions} data={chartData} />
         ) : (
            <div style={{ textAlign: "center", padding: "50px", color: "#A0AEC0" }}>
                <p>No sales data available for this time range.</p>
            </div>
         )}
      </div>

    </div>
  );
}

// Simple Card Component for stats
function StatCard({ title, value, icon, bg, alert }) {
  return (
    <div style={{ 
        backgroundColor: "white", padding: "20px", borderRadius: "15px", 
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "20px", 
        borderLeft: alert ? "5px solid #E53E3E" : "none" 
    }}>
      <div style={{ width: "50px", height: "50px", borderRadius: "12px", backgroundColor: bg, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: "14px", color: "#718096", fontWeight: "500" }}>{title}</h3>
        <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#2D3748" }}>{value}</p>
      </div>
    </div>
  );
}

export default AdminDashboard;