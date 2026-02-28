import { useEffect, useState } from "react";
import Header from "../components/Header";
import Dashboard from "./Dashboard";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`, // 🔒 send JWT token
          },
        });

        const result = await response.json();

        if (result.success) {
          setUser(result.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Profile fetch error:", err.message);
        setUser(null);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p className="text-center text-blue-600">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center text-red-600">No profile found</p>;
  }

  return (
    <>
      <Dashboard />
      <div className="fixed top-4 right-4 z-40 hidden md:block">
        <button
          onClick={() => window.location.assign('/profile')}
          className="bg-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition"
        >
          My Profile
        </button>
      </div>

      <div className="md:ml-64 ml-0 pt-20 flex justify-center w-full">
        <div className="w-full max-w-3xl px-4 md:px-6 py-8 bg-white shadow rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">My Profile</h1>

        <div className="space-y-4">
          <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
    </>
  );
}
