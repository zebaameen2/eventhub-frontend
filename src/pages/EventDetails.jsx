

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AiOutlineInstagram,
  AiFillLinkedin,
  AiOutlineTwitter,
} from "react-icons/ai";
import { TbWorldWww } from "react-icons/tb";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "../components/Header";
import Dashboard from "./Dashboard"

export default function EventDetails() {

  const navigate = useNavigate(); // ✅ add this


  const { eventId } = useParams(); // ✅ eventId from URL
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState("");
  const isHost = event?.created_by === (typeof localStorage !== "undefined" && JSON.parse(localStorage.getItem("userInfo") || "{}")?.id);

  // guard against accidentally matching the `successreg` path as an id
  useEffect(() => {
    if (eventId === "successreg" || eventId === "registration-success" || !eventId) {
      // if we somehow end up on a non-event slug, bounce back to list
      navigate("/events", { replace: true });
    }
  }, [eventId, navigate]);
  const [loader, setLoader] = useState(true);
  const [isReg, setIsReg] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoader(true);
      try {
        console.log("fetching event", eventId);
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${eventId}`);
        const data = await res.json();

        if (res.ok) {
          if (data.event) {
            setEvent(data.event);
            checkRegistration(data.event.id);
            fetchTicketTypes(data.event.id);
            fetchSessions(data.event.id);
          } else {
            // no event returned – navigate back so user doesn't see empty page
            navigate("/events", { replace: true });
          }
        } else {
          console.error("Error fetching event:", data.error || data.message);
          // if the server said 404 or something else, bounce back to list
          navigate("/events", { replace: true });
        }
      } catch (err) {
        console.error("Server error:", err);
      } finally {
        setLoader(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const fetchTicketTypes = async (eid) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${eid}/ticket-types`);
      const data = await res.json();
      if (res.ok && data.ticket_types) setTicketTypes(data.ticket_types);
    } catch (_) {}
  };

  const fetchSessions = async (eid) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${eid}/sessions`);
      const data = await res.json();
      if (res.ok && data.sessions) setSessions(data.sessions);
    } catch (_) {}
  };

  // Check if user is registered for this event
  const checkRegistration = async (eventId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (!userInfo?.id) return;

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${eventId}/registrations`);
      const data = await res.json();

      if (res.ok && data.registrations) {
        const isUserRegistered = data.registrations.some(
          (reg) => reg.user_id === userInfo.id
        );
        setIsReg(isUserRegistered);
      }
    } catch (err) {
      console.error("Error checking registration:", err);
    }
  };

  //  ----------Handle REgister------------------
  const handleRegister = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (!userInfo?.id) {
      alert("User not logged in");
      return;
    }

    if (isReg) {
      alert("You are already registered for this event");
      return;
    }

    if (ticketTypes.length > 0 && !selectedTicketTypeId) {
      alert("Please select a ticket type");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userInfo.id,
          ...(selectedTicketTypeId && { ticket_type_id: selectedTicketTypeId }),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsReg(true);
        // ✅ Redirect to registration success page (renamed)
        navigate("/events/registration-success");
      } else {
        console.error("Registration response error:", data);
        alert(data.error || data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Server error:", err);
      alert("Server error: " + err.message);
    }
  };


  if (loader) {
    return (
      <>

        <div className="ml-64 pt-20 text-center text-red-600">
          Loading...
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>

        <div className="ml-64 pt-20 text-center text-red-600">
          Event not found
        </div>
      </>
    );
  }

  return (
    <>
      <Header eventId={eventId} showViewStats={isHost} />
      <div className="fixed top-4 right-4 z-40 hidden md:block">
        <button
          onClick={() => navigate("/profile")}
          className="bg-[#f02e65] hover:bg-[#d91e52] text-white px-4 py-2 rounded-xl font-medium shadow-sm transition"
        >
          My Profile
        </button>
      </div>
      <div className="md:ml-64 ml-0 pt-20 min-h-screen bg-gray-50/80 pb-12">
        <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{event.eventname}</h1>
          <p className="text-gray-500 mt-1">Hosted by {event.hostname}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-gray-600">
            <span className="font-medium">{event.eventdate}</span>
            <span>{event.address}, {event.city}, {event.state}</span>
          </div>
          {isHost && (
            <button
              type="button"
              onClick={() => navigate(`/events/${eventId}/manage`)}
              className="mt-4 text-[#f02e65] font-medium hover:underline"
            >
              Manage event (ticket types & schedule)
            </button>
          )}
        </div>

        {/* Registration */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Registration</h2>
          {ticketTypes.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ticket type</label>
              <select
                value={selectedTicketTypeId}
                onChange={(e) => setSelectedTicketTypeId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none transition"
              >
                <option value="">Select ticket type</option>
                {ticketTypes.map((tt) => (
                  <option key={tt.id} value={tt.id}>
                    {tt.name}
                    {tt.quantity_limit != null && ` (${(tt.sold_count || 0)}/${tt.quantity_limit} left)`}
                    {tt.price_cents > 0 && ` — $${(tt.price_cents / 100).toFixed(2)}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            className="bg-[#f02e65] hover:bg-[#d91e52] text-white w-full rounded-xl py-3 font-medium shadow-sm transition disabled:opacity-60"
            onClick={handleRegister}
            disabled={isReg}
          >
            {isReg ? "Registered" : "Register"}
          </button>
        </div>

        {/* Event hub */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Event hub</h2>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate(`/events/${eventId}/schedule`)} className="bg-gray-50 hover:bg-[#f02e65]/10 text-gray-700 hover:text-[#f02e65] px-4 py-2.5 rounded-xl font-medium border border-gray-100 hover:border-[#f02e65]/30 transition">
              📅 Schedule
            </button>
            <button type="button" onClick={() => navigate(`/events/${eventId}/announcements`)} className="bg-gray-50 hover:bg-[#f02e65]/10 text-gray-700 hover:text-[#f02e65] px-4 py-2.5 rounded-xl font-medium border border-gray-100 hover:border-[#f02e65]/30 transition">
              📢 Announcements
            </button>
            <button type="button" onClick={() => navigate(`/events/${eventId}/polls`)} className="bg-gray-50 hover:bg-[#f02e65]/10 text-gray-700 hover:text-[#f02e65] px-4 py-2.5 rounded-xl font-medium border border-gray-100 hover:border-[#f02e65]/30 transition">
              📊 Polls
            </button>
            <button type="button" onClick={() => navigate(`/events/${eventId}/qna`)} className="bg-gray-50 hover:bg-[#f02e65]/10 text-gray-700 hover:text-[#f02e65] px-4 py-2.5 rounded-xl font-medium border border-gray-100 hover:border-[#f02e65]/30 transition">
              ❓ Q&A
            </button>
            <button type="button" onClick={() => navigate(`/events/${eventId}/feedback`)} className="bg-gray-50 hover:bg-[#f02e65]/10 text-gray-700 hover:text-[#f02e65] px-4 py-2.5 rounded-xl font-medium border border-gray-100 hover:border-[#f02e65]/30 transition">
              ⭐ Feedback
            </button>
          </div>
        </div>

        {/* Schedule preview */}
        {sessions.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
            <ul className="space-y-2">
              {sessions.slice(0, 5).map((s) => (
                <li key={s.id} className="flex justify-between items-center gap-2 text-sm flex-wrap">
                  <span className="font-medium">{s.title}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-gray-500">
                      {new Date(s.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      –{new Date(s.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {s.meeting_url && (
                      <a href={s.meeting_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline shrink-0">Join meeting</a>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => navigate(`/events/${eventId}/schedule`)}
              className="mt-4 text-[#f02e65] font-medium hover:underline"
            >
              View full schedule →
            </button>
          </div>
        )}

        {/* About */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About Event</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {event.description}
          </ReactMarkdown>

          <h3 className="font-semibold text-gray-900 mt-6 mb-2">Sponsors</h3>
          {event.sponsors &&
            event.sponsors.map((sponsor) => (
              <div key={sponsor.id}>
                <a href={sponsor.url} className="text-[#f02e65] hover:underline">
                  {sponsor.name}
                </a>
              </div>
            ))}

          <div className="flex justify-center gap-6 mt-6 text-gray-400">
            <TbWorldWww size={28} />
            <AiOutlineTwitter size={28} />
            <AiFillLinkedin size={28} />
            <AiOutlineInstagram size={28} />
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
