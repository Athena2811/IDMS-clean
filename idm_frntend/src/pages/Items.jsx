import React, { useEffect, useState } from "react";
import "../styles/ItemSelect.css";
import { useNavigate, useParams } from "react-router-dom";

const API = "http://127.0.0.1:8000/api";

const ItemSelect = () => {
  const [items, setItems] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState({});

  const navigate = useNavigate();
  const { roomId } = useParams();   // ✅ correct way
  const roomTypeId = roomId;

  // ✅ Fetch filtered items + materials
  useEffect(() => {
    if (!roomTypeId) return;

    // Fetch items filtered by room type
    fetch(`${API}/items/?room_type=${roomTypeId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }
      })
      .catch(() => setItems([]));

    // Fetch materials
    fetch(`${API}/materials/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMaterials(data);
        } else {
          setMaterials([]);
        }
      })
      .catch(() => setMaterials([]));

  }, [roomTypeId]);

  // ✅ Toggle furniture
  const toggleItem = (item) => {
    if (selectedItems.includes(item.id)) {
      setSelectedItems(selectedItems.filter(id => id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item.id]);
    }
  };

  // ✅ Select material (one per type)
  const selectMaterial = (material) => {
    setSelectedMaterials({
      ...selectedMaterials,
      [material.material_type]: material.id
    });
  };

  const handleNext = () => {
    navigate("/theme-select", {
      state: {
        roomTypeId,
        selectedItems,
        selectedMaterials
      }
    });
  };

  return (
    <div className="item-page">

      <h2>Select Furniture</h2>

      <div className="card-grid">
        {items.map(item => (
          <div
            key={item.id}
            className={`card ${selectedItems.includes(item.id) ? "selected" : ""}`}
            onClick={() => toggleItem(item)}
          >
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
          </div>
        ))}
      </div>

      <h2>Select Materials</h2>

      <div className="card-grid">
        {materials.map(material => (
          <div
            key={material.id}
            className={`card ${
              selectedMaterials[material.material_type] === material.id
                ? "selected"
                : ""
            }`}
            onClick={() => selectMaterial(material)}
          >
            <img src={material.preview_image} alt={material.name} />
            <h3>{material.name}</h3>
            <p>{material.material_type}</p>
          </div>
        ))}
      </div>

      <button className="next-btn" onClick={handleNext}>
        Continue to Themes →
      </button>

    </div>
  );
};

export default ItemSelect;