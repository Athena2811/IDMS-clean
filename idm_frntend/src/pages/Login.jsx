import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/auth.css"

export default function Login(){

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")

const navigate = useNavigate()

const handleLogin = async (e) => {

e.preventDefault()
setError("")

try{

// LOGIN REQUEST
const res = await axios.post("http://127.0.0.1:8000/api/token/",{
username:username,
password:password
})


// SAVE TOKENS
localStorage.setItem("access",res.data.access)
localStorage.setItem("refresh",res.data.refresh)
localStorage.setItem("username",username)


// CHECK USER ROLE
const role = await axios.get("http://127.0.0.1:8000/api/user-role/",{
headers:{
Authorization:`Bearer ${res.data.access}`
}
})


// ADMIN OR USER REDIRECT
if(role.data.is_admin){
navigate("/admin-dashboard")
}else{
navigate("/room-select")
}

}catch(err){

setError("Invalid username or password")

}

}

return(

<div className="auth-container">

<div className="auth-card">

<h2>Welcome Back</h2>

<p className="subtitle">
Login to continue designing
</p>

{error && <div className="error-box">{error}</div>}

<form onSubmit={handleLogin}>

<input
type="text"
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
required
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button type="submit">
Login
</button>

</form>

<p className="switch-text">

Don’t have an account? 

<span onClick={()=>navigate("/register")}>
Register
</span>

</p>

</div>

</div>

)

}