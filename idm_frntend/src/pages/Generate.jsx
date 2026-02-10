import { useState } from "react";
import api from "../api"; // axios instance with token

export default function Generate() {
  const [themeId, setThemeId] = useState(1);
  const [items, setItems] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);

  const promptSuggestions = [
    "Cozy modern minimal bedroom with warm wood tones",
    "Scandinavian living room with soft daylight",
    "Modern workspace with neutral colors and plants",
  ];

  const generateDesign = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    try {
      setLoading(true);
      setResultImage(null);

      const res = await api.post("/generate-design/", {
        theme: themeId,
        client_room: 1,   // using demo room
        items: items,     // reference items
        prompt: prompt,
      });

      setResultImage("http://127.0.0.1:8000" + res.data.image);
    } catch (err) {
      console.error(err);
      alert("AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Generate AI Design</h2>

      {/* Prompt Suggestions */}
      <div style={{ marginBottom: "10px" }}>
        {promptSuggestions.map((text, i) => (
          <button
            key={i}
            onClick={() => setPrompt(text)}
            style={{ marginRight: "8px", marginBottom: "5px" }}
          >
            {text}
          </button>
        ))}
      </div>

      {/* Prompt Input */}
      <textarea
        placeholder="Describe your room..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {/* Generate Button */}
      <button onClick={generateDesign} disabled={loading}>
        {loading ? "Designing with AI..." : "Generate AI Design"}
      </button>

      {/* Loading Message */}
      {loading && (
        <p style={{ marginTop: "10px" }}>
          ✨ AI is creating your interior design…
        </p>
      )}

      {/* Result Image */}
      {resultImage && (
        <div style={{ marginTop: "20px" }}>
          <h3>AI Generated Design</h3>
          <img
            src={resultImage}
            alt="AI Result"
            style={{ width: "100%", maxWidth: "600px" }}
          />
        </div>
      )}
    </div>
  );
}
