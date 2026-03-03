


import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header({ eventId, showViewStats }) {
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 right-0 max-w-sm bg-white p-5 shadow-xl rounded-b-2xl border-b border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <Link to="/landing" onClick={() => setMobileOpen(false)} className="flex items-center">
                <img src="/logo/logo-transparent-svg.png" alt="Logo" className="h-9" />
              </Link>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition">Home</Link>
              <Link to="/myevents" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition">My Events</Link>
              <Link to="/events" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition">Find Events</Link>
              <Link to="/create" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition">Create Event</Link>
              <Link to="/product-viewer" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition">Product Viewer</Link>
              {eventId && showViewStats && (
                <Link to={`/events/${eventId}/stats`} onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-xl bg-blue-600 text-white font-medium">View Stats</Link>
              )}
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="mt-2 py-2.5 px-3 rounded-xl bg-[#f02e65] text-white font-medium w-max">My Profile</Link>
            </nav>
          </div>
        </div>
      )}

      <div className="hidden md:flex h-screen w-64 bg-white border-r border-gray-100 flex-col justify-between fixed left-0 top-0 z-30">

      {/* TOP LOGO */}
      <div>
        <Link to="/landing" className="flex justify-center py-6 border-b border-gray-100">
          <img
            src="/logo/logo-transparent-svg.png"
            alt="EventHub"
            className="h-16"
          />
        </Link>

        {/* NAV LINKS */}
        <nav className="flex flex-col p-4 gap-1">
          <Link className="py-2.5 px-4 rounded-xl text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition" to="/dashboard">Home</Link>
          <Link className="py-2.5 px-4 rounded-xl text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition" to="/myevents">My Events</Link>
          <Link className="py-2.5 px-4 rounded-xl text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition" to="/events">Find Events</Link>
          <Link className="py-2.5 px-4 rounded-xl text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition" to="/create">Create Event</Link>
          <Link className="py-2.5 px-4 rounded-xl text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition" to="/product-viewer">Product Viewer</Link>
          {eventId && showViewStats && (
            <Link to={`/events/${eventId}/stats`} className="py-2.5 px-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">View Stats</Link>
          )}
        </nav>
      </div>

      {/* SIGN OUT BOTTOM */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="w-full bg-[#f02e65] hover:bg-[#d91e52] text-white py-2.5 rounded-xl font-medium transition shadow-sm"
        >
          Sign Out
        </button>
      </div>

    </div>
    </>
  );
}


