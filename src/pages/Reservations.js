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
    <div style={{ padding: "20px" }}>
      <h1>Reservations</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>Guests</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td>{r.phone}</td>
              <td>{r.date}</td>
              <td>{r.time}</td>
              <td>{r.guests}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
