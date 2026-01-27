import React, { useState, useEffect } from "react";
import API from "../api/api";

const AddEditFood = ({ item, onClose, onSuccess }) => {
  const [name, setName] = useState(item ? item.name : "");
  const [description, setDescription] = useState(item ? item.description : "");
  const [price, setPrice] = useState(item ? item.price : "");
  const [image, setImage] = useState(null);

  const [category, setCategory] = useState(item ? item.category : "");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Fetch existing categories
  const fetchCategories = async () => {
    try {
      const res = await API.get("/food");
      const uniqueCategories = Array.from(new Set(res.data.map(f => f.category || "General")));
      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    const finalCategory = isAddingNew ? newCategory.trim() : category;
    if (!name || !price || !finalCategory) {
      alert("Please fill all required fields!");
      return;
    }

    if (!window.confirm(item
      ? `Are you sure you want to edit "${name}"?`
      : `Are you sure you want to add "${name}"?`
    )) return;

    try {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("category", finalCategory);
  if (image) formData.append("image", image);

  let res;
  if (item) {
    res = await API.put(`/food/${item._id}`, formData);
  } else {
    res = await API.post("/food", formData);
  }

  if (res.status >= 200 && res.status < 300) {
    onSuccess(item ? "✅ Item edited successfully!" : "✅ Item added successfully!");
  } else {
    alert("Something went wrong! Server returned status: " + res.status);
  }
} catch (err) {
  console.error(err);
  // Only alert if truly an error (network/server)
  alert("Check menu for confirmation: " + (err.response?.data?.message || err.message));
}
}

  return (
    <>
      {/* Overlay */}
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 999
      }} onClick={onClose} />

      {/* Modal Box */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "450px",
        backgroundColor: "#fff",
        padding: "30px 25px",
        borderRadius: "10px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        zIndex: 1000,
      }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          {item ? "Edit Menu Item" : "Add Menu Item"}
        </h2>

        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px", fontSize: "14px" }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: "8px", marginBottom: "15px", fontSize: "14px" }}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px", fontSize: "14px" }}
        />

        {/* Category selection */}
        <select
          value={isAddingNew ? "__new" : category}
          onChange={e => {
            if (e.target.value === "__new") {
              setIsAddingNew(true);
              setCategory("");
            } else {
              setIsAddingNew(false);
              setCategory(e.target.value);
            }
          }}
          style={{ width: "100%", padding: "8px", marginBottom: "15px", fontSize: "14px" }}
        >
          <option value="" disabled>Select Category</option>
          {categories.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
          <option value="__new">+ New Category</option>
        </select>

        {isAddingNew && (
          <input
            placeholder="Enter new category"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "15px", fontSize: "14px" }}
          />
        )}

        <input
          type="file"
          onChange={e => setImage(e.target.files[0])}
          style={{ marginBottom: "20px" }}
        />

        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              marginRight: "15px",
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {item ? "Save Changes" : "Add Item"}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default AddEditFood;
