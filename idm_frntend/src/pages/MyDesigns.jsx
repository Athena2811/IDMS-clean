import { useEffect, useState } from "react"
import "../styles/MyDesigns.css"

export default function MyDesigns(){

const [designs,setDesigns] = useState([])
const [loading,setLoading] = useState(true)

useEffect(()=>{

fetch("http://127.0.0.1:8000/api/my-designs/",{
headers:{
"Authorization":`Bearer ${localStorage.getItem("access")}`
}
})
.then(res=>res.json())
.then(data=>{
setDesigns(data)
setLoading(false)
})
.catch(()=>{
setLoading(false)
})

},[])



/* DELETE DESIGN */

const deleteDesign = async(id)=>{

const res = await fetch(`http://127.0.0.1:8000/api/delete-design/${id}/`,{
method:"DELETE",
headers:{
"Authorization":`Bearer ${localStorage.getItem("access")}`
}
})

if(res.ok){
setDesigns(prev=>prev.filter(d=>d.id!==id))
}

}


/* REGENERATE DESIGN */

const regenerateDesign = async(id)=>{

const res = await fetch(`http://127.0.0.1:8000/api/regenerate-design/${id}/`,{
method:"POST"
})

const data = await res.json()

setDesigns(prev =>
prev.map(d =>
d.id === id
? {...d,image:data.image + "?t=" + new Date().getTime()}
: d
)
)

}



/* DOWNLOAD IMAGE */

const downloadImage = async(url)=>{

try{

const response = await fetch(url)

const blob = await response.blob()

const link = document.createElement("a")

link.href = window.URL.createObjectURL(blob)

link.download = "interior-design.png"

document.body.appendChild(link)

link.click()

document.body.removeChild(link)

}catch(err){

console.log(err)

}

}



if(loading){

return <h2 style={{textAlign:"center"}}>Loading designs...</h2>

}



return(

<div className="designs-page">

<h2 className="title">My Designs</h2>

<div className="design-grid">

{designs.map((design)=>{

let imageUrl = design.image

/* Fix if backend returns relative path */

if(imageUrl && !imageUrl.startsWith("http")){
imageUrl = "http://127.0.0.1:8000" + imageUrl
}

return(

<div className="design-card" key={design.id}>

<img
src={imageUrl}
alt="design"
className="design-image"
/>

<div className="card-buttons">

<button
className="download"
onClick={()=>downloadImage(imageUrl)}
>
Download
</button>

<button
className="delete"
onClick={()=>deleteDesign(design.id)}
>
Delete
</button>


</div>

</div>

)

})}

</div>



<div className="create-more">

<button
onClick={()=>window.location.href="/room-select"}
>
Create More Designs
</button>

</div>


</div>

)

}