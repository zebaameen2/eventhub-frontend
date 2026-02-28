import React, { useEffect, useState } from "react";
import { GoBroadcast } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ThreeBackground from "../components/ThreeBackground";
import { useParams } from "react-router-dom"



export default function DashboardBody() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
   const { eventId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_BASE_URL}/api/users`, {
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

    {/* Fixed top-right profile button - stays visible and doesn't affect layout flow */}
    <div className="fixed top-4 right-4 z-40">
      <button
        onClick={() => navigate("/profile")}
        className="bg-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition"
        aria-label="My Profile"
      >
        My Profile
      </button>
    </div>

    <div className="md:ml-64 ml-0 min-h-screen bg-gradient-to-br from-pink-50/60 to-white backdrop-blur-sm">

      <section className="container px-4 md:px-6 py-12 md:py-16 mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Experience Hassle Free Events 🎉
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600">
            Welcome to  <span className="text-pink-600">Event-Hub</span> — where organizing unforgettable
            events becomes smooth, powerful and stress-free.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {[
            { value: "2.7K", label: "Downloads" },
            { value: users.length ? users.length : '-', label: "Users" },
            { value: "74", label: "Files" },
            { value: "46", label: "Places" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-8 text-center hover:scale-105 transition"
            >
              <h2 className="text-3xl font-bold text-pink-600">
                {stat.value}
              </h2>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Users Section */}
        <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Registered Users
          </h2>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-pink-50 transition"
              >
                <div>
                  <p className="font-medium">
                    {u.firstname} {u.lastname}
                  </p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>

                <span className="text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12 md:mt-20">
          <button
            onClick={() => navigate("/create")}
            className="bg-gradient-to-r from-pink-600 to-rose-500 text-white px-10 py-4 rounded-full shadow-xl text-lg font-medium hover:scale-110 transition duration-300"
          >
            🚀 Create Event
          </button>
        </div>

      </section>
    </div>
  </>
);




}



