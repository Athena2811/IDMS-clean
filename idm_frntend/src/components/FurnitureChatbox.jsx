import { useState } from "react"
import "./chatbot.css"

export default function FurnitureChatbox({ room, theme }) {

const [open,setOpen] = useState(false)
const [messages,setMessages] = useState([
  {from:"bot",text:"Hi! Ask me furniture ideas for your room."}
])
const [input,setInput] = useState("")

const sendMessage = async () => {

if(!input.trim()) return

const userMessage = {from:"user",text:input}
setMessages(prev => [...prev,userMessage])

try{

const res = await fetch("http://127.0.0.1:8000/api/chatbot/",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
message:input,
room,
theme
})
})

const data = await res.json()

setMessages(prev => [
...prev,
{from:"bot",text:data.reply}
])

}catch(err){
console.log(err)
}

setInput("")
}

return(

<>

{/* Floating chat icon */}

<div className="chat-icon" onClick={()=>setOpen(!open)}>
💬
</div>


{/* Chat window */}

{open && (

<div className="chat-window">

<div className="chat-header">
InteriorAI Assistant
</div>


<div className="chat-messages">

{messages.map((msg,i)=>(

<div key={i} className={msg.from === "user" ? "user-msg" : "bot-msg"}>
{msg.text}
</div>

))}

</div>


<div className="chat-input">

<input
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder="Ask about furniture..."
/>

<button onClick={sendMessage}>
Send
</button>

</div>

</div>

)}

</>

)

}