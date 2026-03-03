import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const BASE = import.meta.env.VITE_BASE_URL;

export default function EventFeedback() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [myRating, setMyRating] = useState({});
  const [newComment, setNewComment] = useState({});
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!eventId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [sRes, eRes] = await Promise.all([
          fetch(`${BASE}/api/events/${eventId}/sessions`),
          fetch(`${BASE}/api/events/${eventId}`),
        ]);
        const sData = await sRes.json();
        const eData = await eRes.json();
        if (sRes.ok && sData.sessions) setSessions(sData.sessions);
        if (eRes.ok && eData.event) setEvent(eData.event);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId]);

  const loadRating = async (sessionId) => {
    try {
      const opts = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await fetch(`${BASE}/api/sessions/${sessionId}/ratings`, opts);
      const data = await res.json();
      if (res.ok) {
        setRatings((r) => ({ ...r, [sessionId]: data }));
        if (data.my_rating != null) setMyRating((m) => ({ ...m, [sessionId]: data.my_rating }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadComments = async (sessionId) => {
    try {
      const res = await fetch(`${BASE}/api/sessions/${sessionId}/comments`);
      const data = await res.json();
      if (res.ok) setComments((c) => ({ ...c, [sessionId]: data.comments || [] }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    sessions.forEach((s) => {
      loadRating(s.id);
      loadComments(s.id);
    });
  }, [sessions]);

  const submitRating = async (sessionId, rating) => {
    if (!token) {
      alert("Please log in to rate");
      return;
    }
    try {
      const res = await fetch(`${BASE}/api/sessions/${sessionId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating }),
      });
      const data = await res.json();
      if (res.ok) {
        setMyRating((m) => ({ ...m, [sessionId]: rating }));
        loadRating(sessionId);
      } else {
        alert(data.error || "Failed to submit rating");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitComment = async (sessionId) => {
    const text = (newComment[sessionId] || "").trim();
    if (!token || !text) return;
    try {
      const res = await fetch(`${BASE}/api/sessions/${sessionId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ body: text }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewComment((n) => ({ ...n, [sessionId]: "" }));
        loadComments(sessionId);
      } else {
        alert(data.error || "Failed to post comment");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <>
        <Header eventId={eventId} />
        <div className="md:ml-64 ml-0 pt-20 flex justify-center py-12">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Header eventId={eventId} />
      <div className="fixed top-4 right-4 z-40 hidden md:block">
        <button type="button" onClick={() => navigate(`/events/${eventId}`)} className="bg-pink-600 text-white px-4 py-2 rounded-full shadow-md">
          Back to Event
        </button>
      </div>
      <div className="md:ml-64 ml-0 pt-20 min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">{event?.eventname || "Event"} – Feedback</h1>
          <p className="text-gray-600 mb-6">Rate sessions (1–5 stars) and add comments.</p>
          <button type="button" onClick={() => navigate(`/events/${eventId}`)} className="text-pink-600 hover:underline mb-6 md:hidden">← Back</button>

          {sessions.length === 0 ? (
            <p className="text-gray-500">No sessions to give feedback on yet.</p>
          ) : (
            <ul className="space-y-8">
              {sessions.map((session) => {
                const r = ratings[session.id];
                const cmts = comments[session.id] || [];
                const avg = r?.average ?? 0;
                const count = r?.count ?? 0;
                const currentRating = myRating[session.id] ?? r?.my_rating ?? 0;

                return (
                  <li key={session.id} className="bg-white rounded-xl p-5 shadow">
                    <h2 className="font-bold text-lg">{session.title}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {session.start_time && new Date(session.start_time).toLocaleString()}
                    </p>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Your rating</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => submitRating(session.id, star)}
                            className="text-2xl focus:outline-none"
                            title={`${star} star(s)`}
                          >
                            {star <= currentRating ? "★" : "☆"}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Average: {avg > 0 ? avg.toFixed(1) : "—"} ({count} rating{count !== 1 ? "s" : ""})
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Comments</p>
                      <ul className="space-y-2 mb-3">
                        {cmts.map((c) => (
                          <li key={c.id} className="text-sm bg-gray-50 rounded px-3 py-2">
                            <span className="font-medium">{c.users ? `${c.users.firstname || ""} ${c.users.lastname || ""}`.trim() || "User" : "User"}: </span>
                            {c.body}
                            <span className="text-gray-400 text-xs ml-2">{c.created_at && new Date(c.created_at).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={newComment[session.id] || ""}
                          onChange={(e) => setNewComment((n) => ({ ...n, [session.id]: e.target.value }))}
                          className="flex-1 border rounded-lg px-3 py-2 text-sm"
                          onKeyDown={(e) => e.key === "Enter" && submitComment(session.id)}
                        />
                        <button
                          type="button"
                          onClick={() => submitComment(session.id)}
                          className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Post
                        </button>
                      </div>
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
