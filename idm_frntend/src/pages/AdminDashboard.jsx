import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";
import AdminNavbar from "./AdminNavbar";
export default function AdminDashboard() {

  const token = localStorage.getItem("access");

  const [rooms, setRooms] = useState([]);
  const [themes, setThemes] = useState([]);

  const [roomName, setRoomName] = useState("");
  const [roomImage, setRoomImage] = useState(null);

  const [themeName, setThemeName] = useState("");
  const [themeDesc, setThemeDesc] = useState("");
  const [themeImage, setThemeImage] = useState(null);

  useEffect(() => {
    fetchRooms();
    fetchThemes();
  }, []);

  const fetchRooms = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/room_types/");
    setRooms(res.data);
  };

  const fetchThemes = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/themes/");
    setThemes(res.data);
  };

  const addRoom = async () => {
    const formData = new FormData();
    formData.append("name", roomName);
    formData.append("icon", roomImage);

    await axios.post(
      "http://127.0.0.1:8000/api/add-room/",
      formData,
      {
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"multipart/form-data"
        }
      }
    );

    fetchRooms();
  };

  const deleteRoom = async (id) => {
    await axios.delete(
      `http://127.0.0.1:8000/api/delete-room/${id}/`,
      { headers:{ Authorization:`Bearer ${token}` } }
    );

    fetchRooms();
  };

  const addTheme = async () => {
    const formData = new FormData();

    formData.append("name", themeName);
    formData.append("description", themeDesc);
    formData.append("preview_image", themeImage);

    await axios.post(
      "http://127.0.0.1:8000/api/add-theme/",
      formData,
      {
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"multipart/form-data"
        }
      }
    );

    fetchThemes();
  };

  const deleteTheme = async (id) => {
    await axios.delete(
      `http://127.0.0.1:8000/api/delete-theme/${id}/`,
      { headers:{ Authorization:`Bearer ${token}` } }
    );

    fetchThemes();
  };

  const logout = () => {
    localStorage.removeItem("access");
    window.location.href="/login";
  };

  return (

    <>
    <AdminNavbar />

    <div className="admin-container">

      {/* ADD ROOM */}

      <div className="admin-form">

        <input
          type="text"
          placeholder="Room name"
          onChange={(e)=>setRoomName(e.target.value)}
        />

        <input
          type="file"
          onChange={(e)=>setRoomImage(e.target.files[0])}
        />

        <button onClick={addRoom}>
          Add Room
        </button>

      </div>


      {/* ROOMS */}

      <div className="room-grid">

        {rooms.map(room => (

          <div className="room-card" key={room.id}>

            <img
              src={room.icon}
              alt={room.name}
              className="room-image"
            />

            <h3>{room.name}</h3>

            <button
              className="delete-btn"
              onClick={()=>deleteRoom(room.id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>


      {/* THEMES */}

      <h2 className="section-title">
        Themes
      </h2>


      <div className="admin-form">

        <input
          type="text"
          placeholder="Theme name"
          onChange={(e)=>setThemeName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Theme description"
          onChange={(e)=>setThemeDesc(e.target.value)}
        />

        <input
          type="file"
          onChange={(e)=>setThemeImage(e.target.files[0])}
        />

        <button onClick={addTheme}>
          Add Theme
        </button>

      </div>


      <div className="room-grid">

        {themes.map(theme => (

          <div className="room-card" key={theme.id}>

            <img
              src={theme.preview_image}
              alt={theme.name}
              className="room-image"
            />

            <h3>{theme.name}</h3>

            <p className="theme-desc">
              {theme.description}
            </p>

            <button
              className="delete-btn"
              onClick={()=>deleteTheme(theme.id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>

    </>
  );
}