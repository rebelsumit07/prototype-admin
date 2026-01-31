// Reservations.js
import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [notification, setNotification] = useState(null); // For bottom-left notification

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await API.get("/reservations"); // your backend route
        setReservations(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReservations();
  }, []);

  // Show notification for 3 seconds
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the reservation for ${name}?`)) {
      try {
        await API.delete(`/reservations/${id}`);
        setReservations(prev => prev.filter(r => r._id !== id));
        showNotification(`Reservation for ${name} deleted successfully ✅`);
      } catch (err) {
        console.error(err);
        showNotification(`Failed to delete reservation for ${name}. ❌`);
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "'Poppins', sans-serif" }}>
      <h1 style={{ marginBottom: "20px", color: "#2f2f2f" }}>Reservations</h1>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px"
      }}>
        {reservations.length === 0 ? (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#777" }}>
            No reservations found.
          </p>
        ) : (
          reservations.map((r, i) => (
            <div key={i} style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              transition: "transform 0.2s",
              position: "relative"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <h3 style={{ marginBottom: "10px", color: "#b48b5a" }}>{r.name}</h3>
              <p style={{ margin: "4px 0", color: "#555" }}><strong>Phone:</strong> {r.phone}</p>
              <p style={{ margin: "4px 0", color: "#555" }}><strong>Date:</strong> {r.date}</p>
              <p style={{ margin: "4px 0", color: "#555" }}><strong>Time:</strong> {r.time}</p>
              <p style={{ margin: "4px 0", color: "#555" }}><strong>Guests:</strong> {r.guests}</p>
              <p style={{ margin: "4px 0", color: "#555" }}><strong>Message:</strong> {r.message || "No message"}</p>
              
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(r._id, r.name)}
                style={{
                  marginTop: "12px",
                  padding: "8px 14px",
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Notification bar */}
      {notification && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          background: "#27ae60",
          color: "#fff",
          padding: "14px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 9999,
          animation: "slideIn 0.4s forwards"
        }}>
          {notification}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
