import React, { useEffect, useState } from "react";
import API from "../api/api";

// Confirm dialog
const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div style={{
    position: "fixed",
    top: 0, left: 0,
    width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 900,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}>
    <div style={{
      backgroundColor: "#fff",
      padding: "25px",
      borderRadius: "10px",
      width: "350px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.3)"
    }}>
      <p>{message}</p>
      <div style={{ textAlign: "right" }}>
        <button onClick={onConfirm} style={{ padding: "8px 16px", marginRight: "10px", backgroundColor: "#4caf50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Yes</button>
        <button onClick={onCancel} style={{ padding: "8px 16px", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>No</button>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders"); 
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setConfirm({
      message: `Set status to "${newStatus}" for order ${orderId}?`,
      onConfirm: async () => {
        try {
          await API.put(`/orders/${orderId}/status`, { status: newStatus });
          setToast(`✅ Order ${orderId} status updated to "${newStatus}"`);
          fetchOrders();
          setTimeout(() => setToast(""), 3000);
        } catch (err) {
          console.error(err);
        }
        setConfirm(null);
      }
    });
  };

  const handleAddRemarks = (orderId) => {
    const remarks = prompt("Enter remarks for this order:");
    if (!remarks) return;
    setConfirm({
      message: `Add remarks for order ${orderId}?`,
      onConfirm: async () => {
        try {
          await API.put(`/orders/${orderId}/status`, { remarks });
          setToast(`✅ Remarks added to Order ${orderId}`);
          fetchOrders();
          setTimeout(() => setToast(""), 3000);
        } catch (err) {
          console.error(err);
        }
        setConfirm(null);
      }
    });
  };

  const filteredOrders = orders.filter(order =>
    order.orderId.toLowerCase().includes(search.toLowerCase()) ||
    order.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Orders Dashboard</h2>

      <input
        type="text"
        placeholder="Search by Order ID or Phone..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          padding: "8px 12px",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "15px"
        }}
      />

      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {filteredOrders.map(order => (
            <div key={order._id} style={{
              display: "flex",
              flexDirection: "row",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              alignItems: "flex-start",
              justifyContent: "space-between"
            }}>
              {/* Left side: all details */}
              <div style={{ flex: 4, display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ minWidth: "100px" }}><strong>ID:</strong> {order.orderId}</div>
                <div style={{ minWidth: "120px" }}><strong>Customer:</strong> {order.customerName}</div>
                <div style={{ minWidth: "120px" }}><strong>Phone:</strong> {order.phone}</div>
                <div style={{ minWidth: "150px" }}><strong>Address:</strong> {order.address}</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", minWidth: "150px" }}>
                  {(order.items || []).map(i => (
                    <div key={i.foodId} style={{ padding: "4px 8px", backgroundColor: "#f5f5f5", borderRadius: "5px", border: "1px solid #ddd", fontSize: "13px" }}>
                      {i.name} x {i.quantity} (${i.price})
                    </div>
                  ))}
                </div>
                <div style={{ minWidth: "60px" }}><strong>Total:</strong> ${order.total}</div>
                <div style={{ minWidth: "100px" }}><strong>Status:</strong> {order.status}</div>
                <div style={{ minWidth: "100px" }}><strong>Remarks:</strong> {order.remarks || "-"}</div>
                <div style={{ minWidth: "150px", fontSize: "12px", color: "#555" }}>{new Date(order.createdAt).toLocaleString()}</div>
              </div>

              {/* Right side: actions */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                <select
                  onChange={e => handleStatusChange(order.orderId, e.target.value)}
                  defaultValue=""
                  style={{ padding: "6px", borderRadius: "5px", border: "1px solid #ccc" }}
                >
                  <option value="" disabled>Update Status</option>
                  <option value="Received">Received</option>
                  <option value="Processing">Processing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Canceled">Canceled</option>
                </select>
                <button
                  onClick={() => handleAddRemarks(order.orderId)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "5px",
                    backgroundColor: "#2196f3",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Add Remarks
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {toast && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#4caf50",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "5px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
