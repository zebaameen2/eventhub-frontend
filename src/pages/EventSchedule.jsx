import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function EventSchedule() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sessRes, eventRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${eventId}/sessions`),
          fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${eventId}`),
        ]);
        const sessData = await sessRes.json();
        const eventData = await eventRes.json();
        if (sessRes.ok && sessData.sessions) setSessions(sessData.sessions);
        if (eventRes.ok && eventData.event) setEvent(eventData.event);

        const token = localStorage.getItem("token");
        if (token) {
          const bRes = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${eventId}/sessions/bookmarks`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const bData = await bRes.json();
          if (bRes.ok && bData.bookmarks) setBookmarks(new Set(bData.bookmarks.map((b) => b.session_id)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  const toggleBookmark = async (sessionId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to bookmark sessions");
      return;
    }
    const isBookmarked = bookmarks.has(sessionId);
    const url = `${import.meta.env.VITE_BASE_URL}/api/events/${eventId}/sessions/${sessionId}/bookmark`;
    try {
      const res = await fetch(url, {
        method: isBookmarked ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBookmarks((prev) => {
          const next = new Set(prev);
          if (isBookmarked) next.delete(sessionId);
          else next.add(sessionId);
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formatDate = (d) => new Date(d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

  if (loading) {
    return (
      <>
        <Header eventId={eventId} />
        <div className="md:ml-64 ml-0 pt-20 flex justify-center items-center min-h-[40vh]">Loading schedule...</div>
      </>
    );
  }

  return (
    <>
      <Header eventId={eventId} />
      <div className="fixed top-4 right-4 z-40 hidden md:block">
        <button
          onClick={() => navigate(`/events/${eventId}`)}
          className="bg-[#f02e65] hover:bg-[#d91e52] text-white px-4 py-2 rounded-xl font-medium shadow-sm transition"
        >
          Back to Event
        </button>
      </div>
      <div className="md:ml-64 ml-0 pt-20 min-h-screen bg-gray-50/80 p-4 md:p-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{event?.eventname || "Event"}</h1>
          <p className="text-gray-500 mb-6">Schedule</p>
          <button
            type="button"
            onClick={() => navigate(`/events/${eventId}`)}
            className="text-[#f02e65] font-medium hover:underline mb-6 md:hidden"
          >
            ← Back to event
          </button>

          {sessions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">No sessions yet.</div>
          ) : (
            <ul className="space-y-4">
              {sessions.map((session) => {
                const speakers = session.session_speakers?.map((ss) => ss.speakers).filter(Boolean) || [];
                const isBookmarked = bookmarks.has(session.id);
                return (
                  <li key={session.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h2 className="font-bold text-lg">{session.title}</h2>
                        <p className="text-gray-500 text-sm mt-1">
                          {formatDate(session.start_time)} · {formatTime(session.start_time)} – {formatTime(session.end_time)}
                          {session.room && ` · ${session.room}`}
                        </p>
                        {session.description && (
                          <p className="text-gray-600 mt-2 text-sm">{session.description}</p>
                        )}
                        {speakers.length > 0 && (
                          <p className="text-sm text-gray-500 mt-2">
                            Speaker(s): {speakers.map((s) => s?.name).filter(Boolean).join(", ")}
                          </p>
                        )}
                        {session.meeting_url && (
                          <a
                            href={session.meeting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-3 px-3 py-2 text-sm font-medium bg-[#f02e65] text-white rounded-xl hover:bg-[#d91e52] transition"
                          >
                            Join meeting
                          </a>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(session.id)}
                        className="shrink-0 p-2 rounded-full hover:bg-gray-100"
                        title={isBookmarked ? "Remove from my schedule" : "Add to my schedule"}
                      >
                        {isBookmarked ? "⭐" : "☆"}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/events/${eventId}/session/${session.id}/chat`)}
                        className="shrink-0 px-3 py-1.5 text-sm bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200"
                      >
                        Chat
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
