import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/RoomSelect.css";

const RoomSelect = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/room_types/"
        );

        setRooms(response.data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSelect = (room) => {
   navigate("/themes", {
  state: {
    roomTypeName: room.name
  }
});
  };


  if (loading) return <div className="status">Loading rooms...</div>;
  if (error) return <div className="status error">{error}</div>;

  return (
    <div className="room-select-container">
      <h2 className="title">Choose the space you want to redesign</h2>

      <div className="room-grid">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="room-card"
            onClick={() => handleSelect(room)}
          >
            <img
              src={room.icon}
              alt={room.name}
              className="room-image"
            />
            <h3>{room.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomSelect;

