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
        className="bg-[#f02e65] hover:bg-[#d91e52] text-white px-4 py-2 rounded-xl font-medium shadow-sm transition"
        aria-label="My Profile"
      >
        My Profile
      </button>
    </div>

    <div className="md:ml-64 ml-0 min-h-screen bg-gray-50/80 pt-20 pb-12">
      <section className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Experience hassle-free events
          </h1>
          <p className="max-w-xl mx-auto text-gray-500">
            Welcome to <span className="text-[#f02e65] font-medium">EventHub</span> — organize events smoothly and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "2.7K", label: "Downloads" },
            { value: users.length ?? "-", label: "Users" },
            { value: "74", label: "Files" },
            { value: "46", label: "Places" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md transition"
            >
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Registered Users
          </h2>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex justify-between items-center p-3 rounded-xl bg-gray-50/80 hover:bg-gray-50 border border-transparent hover:border-gray-100 transition"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {u.firstname} {u.lastname}
                  </p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
                <span className="text-xs font-medium text-[#f02e65] bg-[#f02e65]/10 px-2.5 py-1 rounded-lg">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/create")}
            className="bg-[#f02e65] hover:bg-[#d91e52] text-white px-8 py-3 rounded-xl font-medium shadow-sm transition"
          >
            Create Event
          </button>
        </div>
      </section>
    </div>
  </>
);




}



