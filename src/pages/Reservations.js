// Reservations.js
import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);

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

            </div>
          ))
        )}
      </div>
    </div>
  );
}

