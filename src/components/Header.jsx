


import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header({eventId}) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile hamburger - visible on small screens */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="bg-white p-2 rounded-lg shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 right-0 bg-white p-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <Link to="/landing" onClick={() => setMobileOpen(false)} className="flex items-center">
                <img src="/logo/logo-transparent-svg.png" alt="Logo" className="h-10" />
              </Link>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-3 text-gray-700 font-medium">
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="py-2 px-3 rounded hover:bg-gray-100">Home</Link>
              <Link to="/myevents" onClick={() => setMobileOpen(false)} className="py-2 px-3 rounded hover:bg-gray-100">My Events</Link>
              <Link to="/events" onClick={() => setMobileOpen(false)} className="py-2 px-3 rounded hover:bg-gray-100">Find Events</Link>
              <Link to="/create" onClick={() => setMobileOpen(false)} className="py-2 px-3 rounded hover:bg-gray-100">Create Event</Link>
              {eventId && (
                <Link to={`/events/${eventId}/stats`} onClick={() => setMobileOpen(false)} className="py-2 px-3 rounded bg-blue-600 text-white">View Stats</Link>
              )}
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="mt-2 py-2 px-3 rounded bg-pink-600 text-white w-max">My Profile</Link>
            </nav>
          </div>
        </div>
      )}

      <div className="hidden md:flex h-screen w-64 bg-white shadow-lg flex-col justify-between fixed left-0 top-0 z-30">

      {/* TOP LOGO */}
      <div>
        <Link to="/landing" className="flex justify-center py-6 border-b">
          <img
            src="/logo/logo-transparent-svg.png"
            alt="Product Logo"
            className="h-20 w-34"
          />
        </Link>

        {/* NAV LINKS */}
        <nav className="flex flex-col p-6 gap-5 text-gray-600 font-medium">

          <Link className="mr-5 hover:text-gray-900 text-gray-500" to="/dashboard">
            Home
          </Link>

          <Link
            className="hover:text-pink-600 transition"
            to="/myevents"
          >
            My Events
          </Link>

          <Link
            className="hover:text-pink-600 transition"
            to="/events"
          >
            Find Events
          </Link>

          <Link
            className="hover:text-pink-600 transition"
            to="/create"
          >
            Create Event
          </Link>

            {eventId && (
        <Link to={`/events/${eventId}/stats`} className="bg-blue-600 text-white px-4 py-2 rounded" >
          View Stats
        </Link> )}

         
        </nav>
      </div>

      {/* SIGN OUT BOTTOM */}
      <div className="p-6 border-t">
        <button
          onClick={handleSignOut}
          className="w-full bg-[#f02e65] hover:bg-[#ab073d] text-white py-2 rounded-full"
        >
          Sign Out
        </button>
      </div>

    </div>
    </>
  );
}


