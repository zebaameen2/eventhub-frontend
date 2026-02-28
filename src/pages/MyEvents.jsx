// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { MdOutlinePlace } from "react-icons/md";
// import { IoIosPeople } from "react-icons/io";


// export default function MyEvents() {
//   const [events, setEvents] = useState([]);
//   const [loader, setLoader] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const response = await fetch("http://localhost:5000/api/events/my", {
//           headers: {
//             Authorization: `Bearer ${token}`, // 🔒 send token
//           },
//         });

//         const result = await response.json();

//         if (result.success) {
//           setEvents(result.events);
//         } else {
//           setEvents([]);
//         }
//       } catch (err) {
//         console.log("Fetch error:", err.message);
//         setEvents([]);
//       }

//       setLoader(false);
//     };

//     fetchEvents();
//   }, []);

//   return (
//     <div className="flex justify-center w-full">



//       <div className="w-full max-w-6xl px-6">
//         <h1 className="text-3xl font-bold text-center py-8">
//           My Active Events
//         </h1>

//         {loader ? (
//           <p className="text-center text-red-600">Loading...</p>
//         ) : events.length === 0 ? (
//           <p className="text-center text-gray-500">
//             No events found 🙂
//           </p>
//         ) : (
//           <div className="space-y-10 pb-10">
//             {events.map((item) => (
//               <div key={item.id}>
//                 <section className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-xl shadow">

//                   <div className="md:w-1/2 w-full">
//                     <img
//                       className="rounded w-full"
//                       src={item.banner_url || "https://via.placeholder.com/600x300"}
//                       alt="event"
//                     />
//                   </div>

//                   <div className="md:w-1/2 w-full flex flex-col">
//                     <h2 className="text-3xl font-bold">
//                       {item.eventname}
//                     </h2>

//                     <p className="my-4 text-gray-600">
//                       {item.description}
//                     </p>

//                     <div className="flex items-center gap-2">
//                       <MdOutlinePlace size={22} />
//                       <p>{item.type}</p>
//                     </div>

//                     <div className="flex items-center gap-2 mt-2">
//                       <IoIosPeople size={22} />
//                       <p>{item.audience}</p>
//                     </div>

//                     <button
//                       className="bg-pink-600 text-white px-6 py-2 rounded mt-6 w-fit"
//                       onClick={() => navigate(`/events/${item.id}`)}
//                     >
//                       View Event
//                     </button>
//                   </div>

//                 </section>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
















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

        const response = await fetch("http://localhost:5000/api/events/my", {
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
      <div className="md:ml-64 ml-0 pt-16 flex h-full justify-center w-full">

        <div className="w-full max-w-6xl px-4 md:px-6">
          <h1 className="text-3xl font-bold text-center py-8">
            My Active Events
          </h1>

          {loader ? (
            <p className="text-center text-red-600">Loading...</p>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500">
              No events found 🙂
            </p>
          ) : (
            <div className="space-y-10 pb-10">
              {events.map((item) => (
                <div key={item.id}>
                  <section className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-xl shadow">
                    <div className="md:w-1/2 w-full">
                      <img
                        className="rounded w-full"
                        src={item.banner_url || "https://via.placeholder.com/600x300"}
                        alt="event"
                      />
                    </div>

                    <div className="md:w-1/2 w-full flex flex-col">
                      <h2 className="text-3xl font-bold">{item.eventname}</h2>

                      <p className="my-4 text-gray-600">{item.description}</p>

                      <div className="flex items-center gap-2">
                        <MdOutlinePlace size={22} />
                        <p>{item.type}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <IoIosPeople size={22} />
                        <p>{item.audience}</p>
                      </div>

                      <div className="mt-6 flex gap-3">
                        {/* Existing View Event button */}
                        <button
                          className="bg-pink-600 text-white px-6 py-2 rounded w-fit"
                          onClick={() => navigate(`/events/${item.id}`)}
                        >
                          View Event
                        </button>

                        {/* ✅ New View Stats button */}
                        <button
                          className="bg-blue-600 text-white px-6 py-2 rounded w-fit"
                          onClick={() => navigate(`/events/${item.id}/stats`)}
                        >
                          View Stats
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );





}








