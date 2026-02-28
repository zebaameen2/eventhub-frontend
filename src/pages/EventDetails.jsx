

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
        const res = await fetch(`http://localhost:5000/api/events/${eventId}`);
        const data = await res.json();

        if (res.ok) {
          if (data.event) {
            setEvent(data.event);
            // Check if user is already registered
            checkRegistration(data.event.id);
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

  // Check if user is registered for this event
  const checkRegistration = async (eventId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (!userInfo?.id) return;

      const res = await fetch(`http://localhost:5000/api/events/${eventId}/registrations`);
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

    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userInfo.id }),
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
      <Header eventId={eventId} />
      <div className="fixed top-4 right-4 z-40 hidden md:block">
        <button
          onClick={() => navigate("/profile")}
          className="bg-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition"
        >
          My Profile
        </button>
      </div>
      <div className="md:ml-64 ml-0 pt-20 min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white max-w-3xl mx-auto rounded-xl p-6 mb-6 shadow">
          <h1 className="text-3xl font-bold">{event.eventname}</h1>

          <p className="text-gray-600 py-2">Hosted by {event.hostname}</p>

          <div className="flex justify-between flex-wrap">
            <p className="font-semibold">{event.eventdate}</p>
            <p>
              {event.address}, {event.city}, {event.state}
            </p>
          </div>
        </div>

        {/* Registration */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl p-6 mb-6 shadow">
          <h2 className="font-bold text-xl mb-3">Registration</h2>
          <button
            className="bg-pink-600 text-white w-full rounded-lg p-3"
            onClick={handleRegister}
          >
            {isReg ? "Registered" : "Register"}
          </button>
        </div>

        {/* About */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl p-6 mb-6 shadow">
          <h2 className="font-bold text-xl mb-4">About Event</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {event.description}
          </ReactMarkdown>

          <h3 className="font-bold mt-6 mb-2">Sponsors</h3>
          {event.sponsors &&
            event.sponsors.map((sponsor) => (
              <div key={sponsor.id}>
                <a href={sponsor.url} className="text-pink-600">
                  {sponsor.name}
                </a>
              </div>
            ))}

          <div className="flex justify-center gap-6 mt-6">
            <TbWorldWww size={30} />
            <AiOutlineTwitter size={30} />
            <AiFillLinkedin size={30} />
            <AiOutlineInstagram size={30} />
          </div>
        </div>
      </div>
    </>
  );
}
