


import React, { useEffect, useState } from "react";
import { GoBroadcast } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ThreeBackground from "../components/ThreeBackground";
import { useParams } from "react-router-dom"



export default function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { eventId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // backend returns { success: true, users: [...] }
        setUsers(data.users || []);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("supabase.auth.token");
    navigate("/login");
  };

 
  return (
    <>
      {/* <Header /> */}
      <Header eventId={eventId} handleSignOut={handleSignOut} />
      <ThreeBackground />

      {/* Fixed top-right profile button and responsive content offset */}
      <div className="fixed top-4 right-4 z-40 md:hidden">
        <button
          onClick={() => navigate("/profile")}
          className="bg-pink-600 text-white px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition text-sm"
        >
          My Profile
        </button>
      </div>

      <div className="md:ml-64 ml-0 bg-gradient-to-br from-pink-50/60 to-white backdrop-blur-sm">
        <div className="fixed top-4 right-4 z-40 hidden md:block">
          <button
            onClick={() => navigate("/profile")}
            className="bg-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition"
          >
            My Profile
          </button>
        </div>

      </div>
    </>
  );




}




