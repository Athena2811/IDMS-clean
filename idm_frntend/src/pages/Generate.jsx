import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "../styles/generate.css"
import FurnitureChatbot from "../components/FurnitureChatbox"
export default function Generate(){

const [image,setImage] = useState(null)
const [suggestion,setSuggestion] = useState("")
const [loading,setLoading] = useState(false)

const navigate = useNavigate()
const location = useLocation()

const room = location.state?.roomTypeName
const theme = location.state?.themeName

console.log("Room:", room)
console.log("Theme:", theme)

const handleGenerate = async ()=>{

setLoading(true)

try{

const res = await fetch("http://127.0.0.1:8000/api/generate-design/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("access")}`
  },
  body: JSON.stringify({ room, theme, suggestion })
})

const data = await res.json()

setImage(data.image)

}catch(err){

console.log(err)

}

setLoading(false)

}

const handleDownload = async ()=>{

const response = await fetch(image)
const blob = await response.blob()

const url = window.URL.createObjectURL(blob)

const link = document.createElement("a")
link.href = url
link.download = "InteriorAI.png"

document.body.appendChild(link)
link.click()

document.body.removeChild(link)

window.URL.revokeObjectURL(url)

navigate("/my-designs")

}

return(

<div className="generate-container">

<h1 className="title">InteriorAI</h1>

<div className="selection-info">
  <p><strong>Room:</strong> {room}</p>
  <p><strong>Theme:</strong> {theme}</p>
</div>
{!image && !loading && (

<button className="generate-btn" onClick={handleGenerate}>
Generate Design
</button>

)}

{loading && (

<div className="loading-section">

<div className="house-loader">

<div className="roof"></div>

<div className="house-row">
<div></div>
<div></div>
<div></div>
</div>

<div className="house-row">
<div></div>
<div></div>
<div></div>
</div>

</div>

<p className="loading-text">AI is designing your room...</p>

</div>

)}

{image && !loading && (

<div className="result-card">

<img src={image} alt="design" className="result-image"/>

<div className="action-buttons">

<button onClick={handleDownload}>Download</button>
<button onClick={handleGenerate}>Regenerate</button>

</div>

<div className="suggest-box">

<input
placeholder="Suggest changes..."
value={suggestion}
onChange={(e)=>setSuggestion(e.target.value)}
/>

<button onClick={handleGenerate}>Apply</button>

</div>
<div className="bottom-nav">

<button
className="designs-btn"
onClick={()=>navigate("/my-designs")}
>
My Designs →
</button>

</div>
</div>
 
)}
<FurnitureChatbot room={room} theme={theme} />
</div>

)

}