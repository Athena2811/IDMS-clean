// import "../styles/profile.css"

export default function Profile(){

const username = localStorage.getItem("username")

return(

<div className="profile-page">

<h1>User Profile</h1>

<div className="profile-card">

<p><strong>Username:</strong> {username}</p>

</div>

</div>

)

}