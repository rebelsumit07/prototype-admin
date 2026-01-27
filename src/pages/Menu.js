import React, { useEffect, useState } from "react";
import API from "../api/api";
import AddEditFood from "./AddEditFood";

// Simple confirm dialog
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
        <button onClick={onConfirm} style={{ padding: "8px 16px", marginRight: "10px", cursor: "pointer", backgroundColor: "#4caf50", color: "#fff", border: "none", borderRadius: "5px" }}>Yes</button>
        <button onClick={onCancel} style={{ padding: "8px 16px", cursor: "pointer", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "5px" }}>No</button>
      </div>
    </div>
  </div>
);

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState("");
  const [confirm, setConfirm] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await API.get("/food");
      setMenu(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleDelete = (item) => {
    setConfirm({
      message: `Are you sure you want to delete "${item.name}"?`,
      onConfirm: async () => {
        try {
          await API.delete(`/food/${item._id}`);
          setToast("✅ Item deleted successfully!");
          fetchMenu();
          setTimeout(() => setToast(""), 3000);
        } catch (err) {
          console.error(err);
        }
        setConfirm(null);
      }
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowAddEdit(true);
  };
  const handleAdd = () => {
    setEditingItem(null);
    setShowAddEdit(true);
  };

  const categories = ["All", ...Array.from(new Set(menu.map(i => i.category || "General")))];

  const filteredMenu = menu.filter(item => {
    const matchName = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "" || categoryFilter === "All" || item.category === categoryFilter;
    return matchName && matchCategory;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Menu Management</h2>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
        <button onClick={handleAdd} style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#4caf50",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold"
        }}>+ Add Item</button>

        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: "8px 12px", flex: 1, fontSize: "15px", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          style={{ padding: "8px 12px", fontSize: "15px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Menu items as cards */}
      {loading ? (
        <p>Loading menu...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {filteredMenu.map(item => (
            <div key={item._id} style={{
              width: "300px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff"
            }}>
              <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
              <div style={{ padding: "15px", flex: 1 }}>
                <h3 style={{ margin: "0 0 10px 0" }}>{item.name}</h3>
                <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#555" }}>{item.description}</p>
                <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Price: ${item.price}</p>
                <p style={{ margin: "0 0 10px 0", fontStyle: "italic", color: "#777" }}>Category: {item.category || "General"}</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => handleEdit(item)} style={{
                    flex: 1,
                    padding: "8px",
                    backgroundColor: "#2196f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}>Edit</button>
                  <button onClick={() => handleDelete(item)} style={{
                    flex: 1,
                    padding: "8px",
                    backgroundColor: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddEdit && (
        <AddEditFood
          item={editingItem}
          onClose={() => setShowAddEdit(false)}
          onSuccess={(msg) => {
            setShowAddEdit(false);
            setToast(msg);
            fetchMenu();
            setTimeout(() => setToast(""), 3000);
          }}
        />
      )}

      {/* Confirm Dialog */}
      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#4caf50",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "5px",
        }}>
          {toast}
        </div>
      )}
    </div>
  );
};

export default Menu;
