
















import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlinePlace } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import Dashboard from "./Dashboard";


function RotatingBox() {
  const ref = useRef();
  return (<mesh ref={ref} rotation={[0.4, 0.2, 0]}>
    <boxGeometry args={[2, 2, 2]} />
    <meshStandardMaterial color="#3b82f6" /> </mesh>);
}




export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/my`, {
          headers: {
            Authorization: `Bearer ${token}`, // 🔒 send token
          },
        });

        const result = await response.json();

        if (result.success) {
          setEvents(result.events);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.log("Fetch error:", err.message);
        setEvents([]);
      }

      setLoader(false);
    };

    fetchEvents();
  }, []);

  return (
    <>
      <Dashboard />
      <div className="md:ml-64 ml-0 pt-20 pb-12">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My events</h1>
          <p className="text-gray-500 mb-8">Events you've created</p>

          {loader ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#f02e65] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
              No events yet. Create one to get started.
            </div>
          ) : (
            <div className="space-y-6">
              {events.map((item) => (
                <section key={item.id} className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="md:w-2/5 aspect-video md:aspect-auto md:h-48 bg-gray-100">
                    <img
                      className="w-full h-full object-cover"
                      src={item.banner_url || "https://via.placeholder.com/600x300"}
                      alt={item.eventname}
                    />
                  </div>
                  <div className="md:w-3/5 p-6 flex flex-col justify-center">
                    <h2 className="text-xl font-semibold text-gray-900">{item.eventname}</h2>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MdOutlinePlace size={16} />{item.type}</span>
                      <span className="flex items-center gap-1"><IoIosPeople size={16} />{item.audience}</span>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        className="bg-[#f02e65] hover:bg-[#d91e52] text-white px-4 py-2 rounded-xl font-medium text-sm transition"
                        onClick={() => navigate(`/events/${item.id}`)}
                      >
                        View event
                      </button>
                      <button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium text-sm transition"
                        onClick={() => navigate(`/events/${item.id}/stats`)}
                      >
                        View stats
                      </button>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );





}








