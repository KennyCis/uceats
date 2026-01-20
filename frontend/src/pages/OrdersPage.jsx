import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { FiClock, FiCheckCircle, FiTrash2 } from "react-icons/fi"; 

// Initialize Socket connection
const socket = io("http://localhost:3000");

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  // Fetch Orders (Initial Load)
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/orders");
      setOrders(response.data);
    } catch (error) {
      // silent error
    }
  };

  useEffect(() => {
    fetchOrders();

    // REAL TIME LISTENER
    socket.on("server:neworder", (newOrder) => {
        // Just add the new order to the list immediately
        setOrders((prevOrders) => [newOrder, ...prevOrders]);
    });

    return () => {
        socket.off("server:neworder");
    };
  }, []);

  // Update Status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
        await axios.patch(`http://localhost:3000/api/orders/${orderId}`, { status: newStatus });
        fetchOrders(); 
    } catch (error) {
        console.error(error);
    }
  };

  // Delete Function
  const handleDelete = async (orderId) => {
      if(!window.confirm("Remove this ticket from the screen?")) return;

      try {
          await axios.delete(`http://localhost:3000/api/orders/${orderId}`);        
          setOrders(prev => prev.filter(o => o._id !== orderId));
      } catch (error) {
          console.error(error);
      }
  };

  const getStatusColor = (status) => {
      if (status === "pending") return { bg: "#FFF5F5", text: "#C53030", border: "#FEB2B2" }; // Red
      if (status === "completed") return { bg: "#F0FFF4", text: "#2F855A", border: "#9AE6B4" }; // Green
      return { bg: "white", text: "black", border: "#E2E8F0" };
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)" }}>
      <Sidebar />
      <div style={{ marginLeft: "250px" }}>
        <Header />
        
        <main style={{ padding: "40px 80px" }}>
            
            {/* HEADER WITHOUT REFRESH BUTTON */}
            <div style={{ marginBottom: "30px", display: "flex", alignItems: "center", gap: "15px" }}>
                <h1 style={{ margin: 0, color: "var(--primary-dark)", fontSize: "28px" }}>
                    Kitchen Orders 👨‍🍳
                </h1>
                
                {/* Live Indicator */}
                <span style={{ 
                    backgroundColor: "#C6F6D5", color: "#22543D", 
                    padding: "5px 12px", borderRadius: "20px", 
                    fontSize: "12px", fontWeight: "bold",
                    display: "flex", alignItems: "center", gap: "6px"
                }}>
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#48BB78", borderRadius: "50%" }}></div>
                    Live
                </span>
            </div>

            {/* ORDERS GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
                
                {orders.map((order) => {
                    const colors = getStatusColor(order.status);
                    
                    return (
                        <div key={order._id} style={{ 
                            backgroundColor: "white", 
                            borderRadius: "15px", 
                            border: `1px solid ${colors.border}`,
                            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                            overflow: "hidden",
                            display: "flex", flexDirection: "column"
                        }}>
                            {/* TICKET HEADER */}
                            <div style={{ 
                                padding: "15px", 
                                backgroundColor: colors.bg, 
                                borderBottom: `1px solid ${colors.border}`,
                                display: "flex", justifyContent: "space-between", alignItems: "center"
                            }}>
                                <span style={{ fontWeight: "bold", color: colors.text }}>#{order._id.slice(-6)}</span>
                                <span style={{ fontSize: "12px", color: colors.text, display: "flex", alignItems: "center", gap: "5px" }}>
                                    <FiClock /> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>

                            {/* CLIENT INFO */}
                            <div style={{ padding: "15px", borderBottom: "1px dashed #E2E8F0" }}>
                                <div style={{ fontSize: "14px", color: "#718096" }}>Customer</div>
                                <div style={{ fontWeight: "bold", color: "#2D3748" }}>{order.client?.name || "Unknown"}</div>
                            </div>

                            {/* ITEMS LIST */}
                            <div style={{ padding: "15px", flex: 1 }}>
                                {order.items.map((item, index) => (
                                    <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                                        <span>
                                            <b style={{ color: "var(--primary-dark)" }}>{item.quantity}x</b> {item.name}
                                        </span>
                                        <span style={{ color: "#718096" }}>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div style={{ marginTop: "15px", paddingTop: "10px", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "16px" }}>
                                    <span>Total:</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* ACTIONS FOOTER */}
                            <div style={{ padding: "15px", backgroundColor: "#F7FAFC", borderTop: "1px solid #E2E8F0" }}>
                                {order.status === "pending" ? (
                                    // STATE 1: READY BUTTON
                                    <button 
                                        onClick={() => handleStatusChange(order._id, "completed")}
                                        style={{ width: "100%", padding: "10px", backgroundColor: "#48BB78", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
                                    >
                                        <FiCheckCircle /> Mark as Ready
                                    </button>
                                ) : (
                                    // STATE 2: COMPLETED + DELETE BUTTON
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ color: "#2F855A", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
                                            <FiCheckCircle /> Completed
                                        </span>
                                        
                                        {/* DELETE BUTTON */}
                                        <button 
                                            onClick={() => handleDelete(order._id)}
                                            style={{ 
                                                backgroundColor: "#FED7D7", color: "#C53030", 
                                                border: "none", borderRadius: "6px", 
                                                padding: "8px", cursor: "pointer",
                                                display: "flex", alignItems: "center"
                                            }}
                                            title="Clear ticket"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {orders.length === 0 && (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#A0AEC0", marginTop: "50px" }}>
                        <h3>No active orders. Kitchen is quiet. 🦗</h3>
                    </div>
                )}

            </div>
        </main>
      </div>
    </div>
  );
}

export default OrdersPage;