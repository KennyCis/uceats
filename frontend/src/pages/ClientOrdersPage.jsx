import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { FiClock, FiCheckCircle, FiPackage, FiArchive } from "react-icons/fi";

const socket = io("http://localhost:3000");

function ClientOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  // Fetch only MY orders
  const fetchMyOrders = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:3000/api/orders/user/${user.id}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchMyOrders();

    socket.on("server:orderupdated", (updatedOrder) => {
        setOrders((prevOrders) => 
            prevOrders.map(order => 
                order._id === updatedOrder._id ? updatedOrder : order
            )
        );
    });

    // Also listen for new orders created by this user in another tab
    socket.on("server:neworder", (newOrder) => {
        if (user && newOrder.client._id === user.id) {
             setOrders(prev => [newOrder, ...prev]);
        }
    });

    return () => {
        socket.off("server:orderupdated");
        socket.off("server:neworder");
    };
  }, [user]);

  // Badge Helper
  const getStatusBadge = (status) => {
      if (status === "pending") return (
          <span style={{ backgroundColor: "#FEFCBF", color: "#D69E2E", padding: "5px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
              <FiClock /> Preparing...
          </span>
      );
      if (status === "completed") return (
          <span style={{ backgroundColor: "#C6F6D5", color: "#2F855A", padding: "5px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
              <FiCheckCircle /> Completed
          </span>
      );
  };

  // 👇 SEPARATE ORDERS LOGIC
  const activeOrders = orders.filter(o => o.status === "pending");
  const pastOrders = orders.filter(o => o.status === "completed");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)" }}>
      <Sidebar />
      <div style={{ marginLeft: "250px" }}>
        <Header />
        
        <main style={{ padding: "40px 80px" }}>
            <h1 style={{ color: "var(--primary-dark)", fontSize: "28px", marginBottom: "30px" }}>
                My Orders 🍔
            </h1>

            {/* SECTION 1: ACTIVE ORDERS (Live Tracking) */}
            <h3 style={{ fontSize: "18px", color: "#4A5568", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                <FiClock /> In Progress
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
                {activeOrders.length === 0 ? (
                    <div style={{ padding: "20px", backgroundColor: "white", borderRadius: "10px", color: "#A0AEC0", fontSize: "14px", fontStyle: "italic" }}>
                        No active orders at the moment.
                    </div>
                ) : (
                    activeOrders.map((order) => (
                        <div key={order._id} style={{ backgroundColor: "white", padding: "20px", borderRadius: "15px", border: "2px solid #FEFCBF", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 10px rgba(214, 158, 46, 0.1)" }}>
                            <div>
                                <div style={{ fontSize: "12px", color: "#A0AEC0", marginBottom: "5px" }}>
                                    Order #{order._id.slice(-6)} • {new Date(order.createdAt).toLocaleTimeString()}
                                </div>
                                <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "5px" }}>
                                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                                </div>
                                <div style={{ fontWeight: "bold", color: "var(--primary-dark)" }}>
                                    Total: ${order.total.toFixed(2)}
                                </div>
                            </div>
                            <div>{getStatusBadge(order.status)}</div>
                        </div>
                    ))
                )}
            </div>

            {/* SECTION 2: ORDER HISTORY (Permanent Log) */}
            <h3 style={{ fontSize: "18px", color: "#4A5568", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px", borderTop: "1px dashed #E2E8F0", paddingTop: "30px" }}>
                <FiArchive /> Order History
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {pastOrders.length === 0 ? (
                    <div style={{ color: "#A0AEC0", fontSize: "14px" }}>No history available.</div>
                ) : (
                    pastOrders.map((order) => (
                        <div key={order._id} style={{ backgroundColor: "#F7FAFC", padding: "15px 20px", borderRadius: "10px", border: "1px solid #EDF2F7", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.8 }}>
                            <div>
                                <div style={{ fontSize: "12px", color: "#A0AEC0" }}>
                                    {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}
                                </div>
                                <div style={{ fontWeight: "600", color: "#4A5568" }}>
                                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontWeight: "bold", fontSize: "14px" }}>${order.total.toFixed(2)}</div>
                                <small style={{ color: "#2F855A", fontWeight: "bold" }}>Completed</small>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </main>
      </div>
    </div>
  );
}

export default ClientOrdersPage;