import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/roomSelect.css";


const rooms = [
  { id: "bedroom", name: "Bedroom", icon: "/room-icons/bedroom.png" },
  { id: "living", name: "Living Room", icon: "/room-icons/living.png" },
  { id: "kitchen", name: "Kitchen", icon: "/room-icons/kitchen.png" },
  { id: "office", name: "Office", icon: "/room-icons/office.png" },
  { id: "custom", name: "Custom Room", icon: "/room-icons/custom.png" },
];

export default function RoomSelect() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedRoom) return;

    localStorage.setItem("room", selectedRoom);

    // IMPORTANT LOGIC
    if (selectedRoom === "custom") {
      navigate("/custom-ai"); // custom AI-only page
    } else {
      navigate("/themes"); // normal flow
    }
  };

  return (
    <div className="room-page">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Select Your Room
      </motion.h1>

      <motion.p
        className="subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Choose the room you want to redesign
      </motion.p>

      <div className="room-grid">
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            className={`room-card ${
              selectedRoom === room.id ? "selected" : ""
            }`}
            onClick={() => setSelectedRoom(room.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <img src={room.icon} alt={room.name} />
            <h3>{room.name}</h3>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="continue-btn"
        onClick={handleContinue}
        disabled={!selectedRoom}
        whileHover={{ scale: selectedRoom ? 1.05 : 1 }}
      >
        Continue
      </motion.button>
    </div>
  );
}
