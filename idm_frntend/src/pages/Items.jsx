import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function Items() {
  const { themeId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // 🔐 AUTH GUARD (CORRECT PLACE)
  useEffect(() => {
    if (!localStorage.getItem("access")) {
      navigate("/login");
      return;
    }

    api
      .get(`/items?theme=${themeId}&room_type=1`)
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, [themeId, navigate]);

  const toggleItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    
    <div style={{ padding: "20px" }}>
      <h2>Select Items</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            style={{
              width: "220px",
              border: selectedItems.includes(item.id)
                ? "3px solid green"
                : "1px solid #ccc",
              padding: "10px",
              cursor: "pointer",
            }}
          >
            <img
              src={`http://127.0.0.1:8000${item.image}`}
              alt={item.name}
              style={{ width: "100%", height: "140px", objectFit: "contain" }}
            />
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
          </div>
        ))}
      </div>
      <button
        disabled={!selectedItems.length}
        onClick={() =>
          navigate("/generate", {
            state: { themeId, items: selectedItems },
          })
        }
        style={{ marginTop: "20px" }}
      >
        Generate Design
      </button>
    </div>
  );
}
