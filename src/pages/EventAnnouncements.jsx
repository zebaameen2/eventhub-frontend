import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const BASE = import.meta.env.VITE_BASE_URL;

export default function EventAnnouncements() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const userInfo = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userInfo") || "{}") : {};

  useEffect(() => {
    if (!eventId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [aRes, eRes] = await Promise.all([
          fetch(`${BASE}/api/events/${eventId}/announcements`),
          fetch(`${BASE}/api/events/${eventId}`),
        ]);
        const aData = await aRes.json();
        const eData = await eRes.json();
        if (aRes.ok && aData.announcements) setAnnouncements(aData.announcements);
        if (eRes.ok && eData.event) {
          setEvent(eData.event);
          setIsHost(eData.event.created_by === userInfo.id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to create announcements");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/api/events/${eventId}/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), send_email: sendEmail }),
      });
      const data = await res.json();
      if (res.ok && data.announcement) {
        setAnnouncements((prev) => [data.announcement, ...prev]);
        setTitle("");
        setBody("");
        setShowForm(false);
      } else {
        alert(data.error || "Failed to create announcement");
      }
    } catch (err) {
      console.error(err);
      alert("Request failed");
    } finally {
      setSubmitting(false);
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
        <button
          type="button"
          onClick={() => navigate(`/events/${eventId}`)}
          className="bg-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition"
        >
          Back to Event
        </button>
      </div>
      <div className="md:ml-64 ml-0 pt-20 min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">{event?.eventname || "Event"} – Announcements</h1>
          <button type="button" onClick={() => navigate(`/events/${eventId}`)} className="text-pink-600 hover:underline mb-6 md:hidden">
            ← Back to event
          </button>

          {isHost && (
            <div className="mb-6">
              {!showForm ? (
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg"
                >
                  New announcement
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow space-y-3">
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  <textarea
                    placeholder="Message"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    rows={4}
                  />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
                    Send by email to accepted attendees
                  </label>
                  <div className="flex gap-2">
                    <button type="submit" disabled={submitting} className="bg-pink-600 text-white px-4 py-2 rounded-lg">
                      {submitting ? "Sending…" : "Post"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="border px-4 py-2 rounded-lg">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {announcements.length === 0 ? (
            <p className="text-gray-500">No announcements yet.</p>
          ) : (
            <ul className="space-y-4">
              {announcements.map((a) => (
                <li key={a.id} className="bg-white rounded-xl p-4 shadow">
                  <h2 className="font-bold text-lg">{a.title}</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {a.created_at && new Date(a.created_at).toLocaleString()}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap">{a.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
