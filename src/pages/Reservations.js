// Reservations.js
import React, { useEffect, useState } from "react";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [notification, setNotification] = useState("");

  // Fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch("https://prototype-xcoa.onrender.com/reservations");
        const data = await res.json();
        setReservations(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReservations();
  }, []);

  // Delete reservation
  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the reservation for ${name}?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://prototype-xcoa.onrender.com/reservations/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok) {
        setReservations(prev => prev.filter(r => r._id !== id));
        setNotification(`Reservation for ${name} deleted successfully`);
        setTimeout(() => setNotification(""), 4000); // hide after 4s
      } else {
        alert(data.message || "Failed to delete. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting reservation. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "'Poppins', sans-serif" }}>
      <h1 style={{ marginBottom: "20px", color: "#2f2f2f" }}>Reservations</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
              position: "relative",
              transition: "transform 0.2s"
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

              <button
                onClick={() => handleDelete(r._id, r.name)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >Delete</button>
            </div>
          ))
        )}
      </div>

      {/* Right-bottom notification */}
      {notification && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#4caf50",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          fontWeight: "500",
          zIndex: 1000,
          transform: "translateX(120%)",
          animation: "slideIn 0.5s forwards"
        }}>
          {notification}
        </div>
      )}

      {/* Slide-in animation */}
      <style>
        {`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        `}
      </style>
    </div>
  );
}
