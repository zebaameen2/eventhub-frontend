


import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import Dashboard from "./Dashboard";


export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoader(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events`);
        const data = await res.json();

        if (res.ok && data.success) {
          setEvents(data.events); // ✅ backend se real events
        } else {
          console.error("Error:", data.message || data.error);
        }
      } catch (err) {
        console.error("Server error:", err);
      } finally {
        setLoader(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <Dashboard />
      {/* RIGHT PANEL */}
      <div className="md:ml-64 ml-0 min-h-screen bg-gray-50/80 pt-20 pb-12">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            All Active Events
          </h1>
          <p className="text-gray-500 mb-8">Discover and join events</p>

          {loader ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#f02e65] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
              No events yet. Create one to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((item) => (
                <EventCard key={item.id} event={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
