





// // import { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import CsvDownloader from "react-csv-downloader";
// // import { supabase } from "../supabaseClient"; // 👈 IMPORT SUPABASE

// // export default function EventStats() {
// //   const { event } = useParams();

// //   const [docs, setDocs] = useState([]);
// //   const [eventData, setEventData] = useState(null);

// //   const callAPI = async (email, subject, message) => {
// //     try {
// //       await fetch("https://send-grid-api.vercel.app/sendemail", {
// //         method: "POST",
// //         body: JSON.stringify({ email, subject, message }),
// //         headers: { "content-type": "application/json" },
// //       });
// //     } catch (err) {
// //       console.log("Email API not running yet 🙂");
// //     }
// //   };

// //   const asyncFnComputeDate = () => {
// //     const data = docs.map((doc) => ({
// //       name: doc.name,
// //       email: doc.email,
// //     }));
// //     return Promise.resolve(data);
// //   };

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         // ✅ Fetch registrations for this event
// //         const { data: regData, error: regError } = await supabase
// //           .from("registrations")
// //           .select("*")
// //           .eq("event_id", event);

// //         if (regError) throw regError;
// //         setDocs(regData || []);

// //         // ✅ Fetch event info
// //         const { data: eventInfo, error: eventError } = await supabase
// //           .from("events")
// //           .select("*")
// //           .eq("id", event)
// //           .single();

// //         if (eventError) throw eventError;
// //         setEventData(eventInfo);
// //       } catch (err) {
// //         console.error("Error fetching stats:", err.message);
// //         setDocs([]);
// //       }
// //     };

// //     fetchData();
// //   }, [event]);

// //   const handleAcceptanceEmail = async (id, name, email) => {
// //     await supabase
// //       .from("registrations")
// //       .update({ confirm: "accept" })
// //       .eq("id", id);

// //     callAPI(
// //       email,
// //       "Accepted 🎉",
// //       `Hey ${name}, you are accepted for ${eventData?.eventname}`
// //     );
// //   };

// //   const handleRejectionEmail = async (id, name, email) => {
// //     await supabase
// //       .from("registrations")
// //       .update({ confirm: "reject" })
// //       .eq("id", id);

// //     callAPI(
// //       email,
// //       "Rejected",
// //       `Hey ${name}, you are rejected for ${eventData?.eventname}`
// //     );
// //   };

// //   return (
// //     <div className="flex justify-center w-full">
// //       <div className="w-full max-w-6xl px-6 py-10">
// //         <h1 className="text-3xl font-bold mb-8 text-center">
// //           Event Attendees
// //         </h1>

// //         <div className="overflow-x-auto">
// //           <table className="w-full bg-white shadow rounded-xl">
// //             <thead className="bg-gray-100">
// //               <tr>
// //                 <th className="p-3 text-left">Name</th>
// //                 <th className="text-left">Email</th>
// //                 <th className="text-center">Actions</th>
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {docs.map((attendee) => (
// //                 <tr key={attendee.id} className="border-t">
// //                   <td className="p-3">{attendee.name}</td>
// //                   <td>{attendee.email}</td>

// //                   <td className="text-center space-x-2">
// //                     <button
// //                       className="bg-green-500 text-white px-4 py-1 rounded"
// //                       onClick={() =>
// //                         handleAcceptanceEmail(
// //                           attendee.id,
// //                           attendee.name,
// //                           attendee.email
// //                         )
// //                       }
// //                     >
// //                       Accept
// //                     </button>

// //                     <button
// //                       className="bg-red-500 text-white px-4 py-1 rounded"
// //                       onClick={() =>
// //                         handleRejectionEmail(
// //                           attendee.id,
// //                           attendee.name,
// //                           attendee.email
// //                         )
// //                       }
// //                     >
// //                       Reject
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         <div className="mt-8 flex justify-center">
// //           <CsvDownloader
// //             datas={asyncFnComputeDate}
// //             filename="registrations"
// //             text="Export CSV"
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import CsvDownloader from "react-csv-downloader";
// import { supabase } from "../supabaseClient"; // 👈 Supabase client

// export default function EventStats() {
//   const { event } = useParams();

//   const [docs, setDocs] = useState([]);
//   const [eventData, setEventData] = useState(null);

//   // ✅ Email API
//   const callAPI = async (email, subject, message) => {
//     try {
//       await fetch("https://send-grid-api.vercel.app/sendemail", {
//         method: "POST",
//         body: JSON.stringify({ email, subject, message }),
//         headers: { "content-type": "application/json" },
//       });
//     } catch (err) {
//       console.log("Email API not running yet 🙂");
//     }
//   };

//   // ✅ CSV Export
//   const asyncFnComputeDate = () => {
//     const data = docs.map((doc) => ({
//       name: doc.name,
//       email: doc.email,
//     }));
//     return Promise.resolve(data);
//   };

//   // ✅ Fetch registrations + event info
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (token) supabase.auth.setAuth(token); // attach JWT

//         const { data: regData, error: regError } = await supabase
//           .from("registrations")
//           .select("*")
//           .eq("event_id", event);

//         if (regError) throw regError;
//         setDocs(regData || []);

//         const { data: eventInfo, error: eventError } = await supabase
//           .from("events")
//           .select("*")
//           .eq("id", event)
//           .single();

//         if (eventError) throw eventError;
//         setEventData(eventInfo);
//       } catch (err) {
//         console.error("Error fetching stats:", err.message);
//         setDocs([]);
//       }
//     };

//     fetchData();
//   }, [event]);

//   // ✅ Accept attendee
//   const handleAcceptanceEmail = async (id, name, email) => {
//     const token = localStorage.getItem("token");
//     if (token) supabase.auth.setAuth(token);

//     await supabase.from("registrations").update({ confirm: "accept" }).eq("id", id);

//     callAPI(email, "Accepted 🎉", `Hey ${name}, you are accepted for ${eventData?.eventname}`);
//   };

//   // ✅ Reject attendee
//   const handleRejectionEmail = async (id, name, email) => {
//     const token = localStorage.getItem("token");
//     if (token) supabase.auth.setAuth(token);

//     await supabase.from("registrations").update({ confirm: "reject" }).eq("id", id);

//     callAPI(email, "Rejected", `Hey ${name}, you are rejected for ${eventData?.eventname}`);
//   };

//   return (
//     <div className="flex justify-center w-full">
//       <div className="w-full max-w-6xl px-6 py-10">
//         <h1 className="text-3xl font-bold mb-8 text-center">Event Attendees</h1>

//         <div className="overflow-x-auto">
//           <table className="w-full bg-white shadow rounded-xl">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 text-left">Name</th>
//                 <th className="text-left">Email</th>
//                 <th className="text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {docs.map((attendee) => (
//                 <tr key={attendee.id} className="border-t">
//                   <td className="p-3">{attendee.name}</td>
//                   <td>{attendee.email}</td>

//                   <td className="text-center space-x-2">
//                     <button
//                       className="bg-green-500 text-white px-4 py-1 rounded"
//                       onClick={() =>
//                         handleAcceptanceEmail(attendee.id, attendee.name, attendee.email)
//                       }
//                     >
//                       Accept
//                     </button>

//                     <button
//                       className="bg-red-500 text-white px-4 py-1 rounded"
//                       onClick={() =>
//                         handleRejectionEmail(attendee.id, attendee.name, attendee.email)
//                       }
//                     >
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-8 flex justify-center">
//           <CsvDownloader
//             datas={asyncFnComputeDate}
//             filename="registrations"
//             text="Export CSV"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CsvDownloader from "react-csv-downloader";
import Header from "../components/Header";

export default function EventStats() {
  // the route defines either `:id` or `:event` depending on where it's used
  const { event, id } = useParams();
  const eventId = event || id; // normalize

  const [docs, setDocs] = useState([]);
  const [eventData, setEventData] = useState(null);

  // short-lived toast message
  const [toast, setToast] = useState(null);
  const showToast = (msg, ms = 2500) => {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  };

  // ✅ Email API (uses local dev endpoint when on localhost)
  const callAPI = async (email, subject, message) => {
    const url = window.location.hostname.includes("localhost")
      ? "http://localhost:5000/api/send-email"
      : "https://send-grid-api.vercel.app/sendemail";

    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ email, subject, message }),
        headers: { "content-type": "application/json" },
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.warn("Email API returned non-OK status:", res.status, body);
        return false;
      }
      return true;
    } catch (err) {
      console.warn("Email API error:", err.message || err);
      return false;
    }
  };

  // ✅ CSV Export
  const asyncFnComputeDate = () => {
    const data = docs.map((doc) => ({
      name: `${doc.users?.firstname || ""} ${doc.users?.lastname || ""}`.trim(),
      email: doc.users?.email,
    }));
    return Promise.resolve(data);
  };

  // ✅ Fetch registrations + event info from backend
  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/events/${eventId}/registrations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      // debug: log backend response so we can see why the table is empty
      console.log("REGISTRATIONS FETCH RESULT", { eventId, ok: res.ok, result });

      if (result.success) {
        setDocs(result.registrations || []);
        setEventData(result.event || null);
      } else {
        setDocs([]);
      }
    } catch (err) {
      console.error("Error fetching stats:", err.message);
      setDocs([]);
    }
  };

  useEffect(() => {
    if (!eventId) return;
    fetchRegistrations();
  }, [eventId]);

  // ✅ Accept attendee
  const handleAcceptanceEmail = async (id, name, email) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/registrations/${id}/accept`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        showToast(`Error accepting registration: ${res.statusText}`);
        return;
      }

      // Optimistically update local UI to show accepted immediately
      setDocs((d) => d.map((r) => (r.id === id ? { ...r, confirm: "accept" } : r)));
      // also refresh registrations in background
      fetchRegistrations();
      showToast(`Accepted — email sent to ${email}`);
    } catch (err) {
      console.error("Network error accepting registration", err);
      showToast("Could not communicate with server");
    }
  };

  // 📦 Delete registration
  const handleDeleteRegistration = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5000/api/registrations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocs((d) => d.filter((r) => r.id !== id));
      showToast("Registration removed");
    } catch (err) {
      console.error("Network error deleting registration", err);
      showToast("Could not communicate with server");
    }
  };

  // ✅ Reject attendee
  const handleRejectionEmail = async (id, name, email) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/registrations/${id}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        showToast(`Error rejecting registration: ${res.statusText}`);
        return;
      }

      // remove row immediately and show toast
      setDocs((d) => d.filter((r) => r.id !== id));
      showToast(`Rejected — email sent to ${email}`);
    } catch (err) {
      console.error("Network error rejecting registration", err);
      showToast("Could not communicate with server");
    }
  };


  return (
    <>
      <Header eventId={eventId} />
      <div className="fixed top-4 right-4 z-40 hidden md:block">
        <button
          onClick={() => window.location.assign('/profile')}
          className="bg-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition"
        >
          My Profile
        </button>
      </div>
      <div className="md:ml-64 ml-0 pt-16">
      {toast && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow z-50">
          {toast}
        </div>
      )}
      <div className="flex justify-center w-full">
      <div className="w-full max-w-6xl px-4 md:px-6 py-8 md:py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Event Attendees</h1>

        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded-xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {docs.map((attendee) => (
                <tr key={attendee.id} className="border-t">
                  <td className="p-3">{`${attendee.users?.firstname || ""} ${attendee.users?.lastname || ""}`.trim()}</td>
                  <td>{attendee.users?.email}</td>

                  <td className="text-center space-x-2">
                    {attendee.confirm === "accept" || attendee.confirm === "accepted" ? (
                      <span className="text-green-600 font-semibold">Accepted</span>
                    ) : attendee.confirm === "reject" || attendee.confirm === "rejected" ? (
                      <span className="text-red-600 font-semibold">Rejected</span>
                    ) : (
                      <>
                        <button
                          className="bg-green-500 text-white px-4 py-1 rounded"
                          onClick={() =>
                            handleAcceptanceEmail(
                              attendee.id,
                              `${attendee.users?.firstname || ""} ${attendee.users?.lastname || ""}`.trim(),
                              attendee.users?.email
                            )
                          }
                        >
                          Accept
                        </button>

                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded"
                          onClick={() =>
                            handleRejectionEmail(
                              attendee.id,
                              `${attendee.users?.firstname || ""} ${attendee.users?.lastname || ""}`.trim(),
                              attendee.users?.email
                            )
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      className="text-gray-500 hover:text-red-600 ml-2"
                      title="Remove registration"
                      onClick={() => handleDeleteRegistration(attendee.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center">
          <CsvDownloader
            datas={asyncFnComputeDate}
            filename="registrations"
            text="Export CSV"
          />
        </div>
      </div>
    </div>
  </div>
  </>
  );
}
