import { useEffect, useState } from "react";
import api from "../api";

export default function MyDesigns() {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    api.get("/my-designs/")
      .then((res) => setDesigns(res.data))
      .catch((err) => console.error(err));
  }, []);

 const downloadImage = async (imageUrl) => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000" + imageUrl,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `interior-design-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed", err);
  }
};

  // ❌ DELETE DESIGN
  const deleteDesign = (id) => {
    if (!window.confirm("Delete this design?")) return;

    api.delete(`/delete-design/${id}/`)
      .then(() => {
        setDesigns(designs.filter((d) => d.id !== id));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Designs</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {designs.map((design) => (
          <div
            key={design.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "300px",
            }}
          >
            <img
              src={`http://127.0.0.1:8000${design.generated_image}`}
              alt="Design"
              style={{ width: "100%" }}
            />

            <p><b>Prompt:</b> {design.prompt}</p>
            <p style={{ fontSize: "12px" }}>
              {new Date(design.created_at).toLocaleString()}
            </p>

            <button onClick={() => downloadImage(design.generated_image)}>
              Download
            </button>

            <button
              onClick={() => deleteDesign(design.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}