// import { useEffect, useState } from "react";
// import EventCard from "../components/EventCard";

// export default function EventsList() {
//   const [events, setEvents] = useState([]);
//   const [loader, setLoader] = useState(false);

//   useEffect(() => {
//     setLoader(true);

//     setTimeout(() => {
//       setEvents([
//         {
//           id: 1,
//           eventname: "Tech Conference 2026",
//           agenda: "Talks → Networking",
//           type: "Conference",
//           audience: "Developers",
//           url: "https://via.placeholder.com/300",
//           created: "user123",
//         },
//         {
//           id: 2,
//           eventname: "Startup Meetup",
//           agenda: "Pitch → Networking",
//           type: "Meetup",
//           audience: "Entrepreneurs",
//           url: "https://via.placeholder.com/300",
//           created: "user456",
//         },
//       ]);
//       setLoader(false);
//     }, 500);
//   }, []);

//   return (
//     <div className="flex justify-center w-full">

//       <div className="w-full max-w-6xl px-6 py-8">

//         <h1 className="text-3xl font-bold mb-8 text-gray-800">
//           All Active Events
//         </h1>

//         {loader ? (
//           <p className="text-red-600">Loading...</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {events.map((item) => (
//               <EventCard key={item.id} event={item} />
//             ))}
//           </div>
//         )}

//       </div>

//     </div>
//   );
// } 


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
        const res = await fetch("http://localhost:5000/api/events");
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
      <div className="md:ml-64 ml-0 min-h-screen bg-gray-50 pt-16">
        <div className="flex justify-center w-full">
          <div className="w-full max-w-6xl px-4 md:px-6 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
              All Active Events
            </h1>

            {loader ? (
              <p className="text-red-600">Loading...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((item) => (
                  <EventCard key={item.id} event={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
