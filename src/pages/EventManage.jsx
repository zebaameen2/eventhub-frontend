import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const BASE = import.meta.env.VITE_BASE_URL;

export default function EventManage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);

  const [newTicket, setNewTicket] = useState({ name: "", description: "", price_cents: 0, quantity_limit: "" });
  const [newSession, setNewSession] = useState({ title: "", description: "", start_time: "", end_time: "", room: "", meeting_url: "" });
  const [editingLinkSessionId, setEditingLinkSessionId] = useState(null);
  const [editingLinkValue, setEditingLinkValue] = useState("");
  const [linkSaving, setLinkSaving] = useState(false);
  const [newSpeaker, setNewSpeaker] = useState({ name: "", bio: "", linkedin_url: "", twitter_handle: "" });

  useEffect(() => {
    if (!eventId) return;
    const token = localStorage.getItem("token");
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (!token || !userInfo.id) {
      navigate("/login");
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [eRes, ttRes, sRes, spRes] = await Promise.all([
          fetch(`${BASE}/api/events/${eventId}`),
          fetch(`${BASE}/api/events/${eventId}/ticket-types`),
          fetch(`${BASE}/api/events/${eventId}/sessions`),
          fetch(`${BASE}/api/events/${eventId}/speakers`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
        ]);
        const eData = await eRes.json();
        const ttData = await ttRes.json();
        const sData = await sRes.json();
        const spData = await spRes.json();

        if (eRes.ok && eData.event) {
          setEvent(eData.event);
          setIsHost(eData.event.created_by === userInfo.id);
        }
        if (ttRes.ok && ttData.ticket_types) setTicketTypes(ttData.ticket_types);
        if (sRes.ok && sData.sessions) setSessions(sData.sessions);
        if (spRes.ok && spData.speakers) setSpeakers(spData.speakers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [eventId, navigate]);

  const addTicketType = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE}/api/events/${eventId}/ticket-types`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: newTicket.name,
        description: newTicket.description || null,
        price_cents: Number(newTicket.price_cents) || 0,
        quantity_limit: newTicket.quantity_limit ? Number(newTicket.quantity_limit) : null,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ticket_type) {
      setTicketTypes((prev) => [...prev, data.ticket_type]);
      setNewTicket({ name: "", description: "", price_cents: 0, quantity_limit: "" });
    } else {
      alert(data.error || "Failed to add ticket type");
    }
  };

  const addSpeaker = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE}/api/events/${eventId}/speakers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: newSpeaker.name,
        bio: newSpeaker.bio || null,
        linkedin_url: newSpeaker.linkedin_url || null,
        twitter_handle: newSpeaker.twitter_handle || null,
      }),
    });
    const data = await res.json();
    if (res.ok && data.speaker) {
      setSpeakers((prev) => [...prev, data.speaker]);
      setNewSpeaker({ name: "", bio: "", linkedin_url: "", twitter_handle: "" });
    } else {
      alert(data.error || "Failed to add speaker");
    }
  };

  const addSession = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const start = newSession.start_time ? new Date(newSession.start_time).toISOString() : "";
    const end = newSession.end_time ? new Date(newSession.end_time).toISOString() : "";
    const res = await fetch(`${BASE}/api/events/${eventId}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: newSession.title,
        description: newSession.description || null,
        start_time: start,
        end_time: end,
        room: newSession.room || null,
        meeting_url: newSession.meeting_url?.trim() || null,
        speaker_ids: [],
      }),
    });
    const data = await res.json();
    if (res.ok && data.session) {
      setSessions((prev) => [...prev, data.session]);
      setNewSession({ title: "", description: "", start_time: "", end_time: "", room: "", meeting_url: "" });
    } else {
      alert(data.error || "Failed to add session");
    }
  };

  const saveSessionMeetingLink = async (sessionId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLinkSaving(true);
    try {
      const res = await fetch(`${BASE}/api/events/${eventId}/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ meeting_url: editingLinkValue.trim() || null }),
      });
      const data = await res.json();
      if (res.ok && data.session) {
        setSessions((prev) => prev.map((s) => (s.id === sessionId ? data.session : s)));
        setEditingLinkSessionId(null);
        setEditingLinkValue("");
      } else {
        alert(data.error || "Failed to update link");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update link");
    } finally {
      setLinkSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header eventId={eventId} showViewStats={isHost} />
        <div className="md:ml-64 ml-0 pt-20 flex justify-center py-12">Loading...</div>
      </>
    );
  }

  if (!event || !isHost) {
    return (
      <>
        <Header eventId={eventId} showViewStats={isHost} />
        <div className="md:ml-64 ml-0 pt-20 p-6">
          <p className="text-gray-600">You can only manage an event you created.</p>
          <button type="button" onClick={() => navigate(`/events/${eventId}`)} className="mt-4 text-pink-600 hover:underline">Back to event</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header eventId={eventId} showViewStats={isHost} />
      <div className="md:ml-64 ml-0 pt-20 min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Manage: {event.eventname}</h1>
            <button type="button" onClick={() => navigate(`/events/${eventId}`)} className="text-pink-600 hover:underline">View event</button>
          </div>

          <section className="bg-white rounded-xl p-6 shadow">
            <h2 className="font-bold text-lg mb-3">Ticket types</h2>
            <ul className="mb-4 space-y-1">
              {ticketTypes.map((tt) => (
                <li key={tt.id} className="text-sm">
                  {tt.name} — ${(tt.price_cents / 100).toFixed(2)}
                  {tt.quantity_limit != null && ` (${tt.sold_count || 0}/${tt.quantity_limit})`}
                </li>
              ))}
            </ul>
            <form onSubmit={addTicketType} className="space-y-2">
              <input
                type="text"
                placeholder="Name (e.g. VIP, General)"
                value={newTicket.name}
                onChange={(e) => setNewTicket((p) => ({ ...p, name: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newTicket.description}
                onChange={(e) => setNewTicket((p) => ({ ...p, description: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Price (cents)"
                  value={newTicket.price_cents || ""}
                  onChange={(e) => setNewTicket((p) => ({ ...p, price_cents: e.target.value }))}
                  className="border rounded px-3 py-2 w-24"
                />
                <input
                  type="number"
                  placeholder="Quantity limit (optional)"
                  value={newTicket.quantity_limit}
                  onChange={(e) => setNewTicket((p) => ({ ...p, quantity_limit: e.target.value }))}
                  className="border rounded px-3 py-2 flex-1"
                />
              </div>
              <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded-lg">Add ticket type</button>
            </form>
          </section>

          <section className="bg-white rounded-xl p-6 shadow">
            <h2 className="font-bold text-lg mb-3">Speakers</h2>
            <ul className="mb-4 space-y-1">
              {speakers.map((s) => (
                <li key={s.id} className="text-sm">{s.name}</li>
              ))}
            </ul>
            <form onSubmit={addSpeaker} className="space-y-2">
              <input
                type="text"
                placeholder="Speaker name"
                value={newSpeaker.name}
                onChange={(e) => setNewSpeaker((p) => ({ ...p, name: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                required
              />
              <textarea
                placeholder="Bio (optional)"
                value={newSpeaker.bio}
                onChange={(e) => setNewSpeaker((p) => ({ ...p, bio: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                rows={2}
              />
              <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded-lg">Add speaker</button>
            </form>
          </section>

          <section className="bg-white rounded-xl p-6 shadow">
            <h2 className="font-bold text-lg mb-3">Sessions</h2>
            <ul className="mb-4 space-y-3">
              {sessions.map((s) => (
                <li key={s.id} className="text-sm border-b border-gray-100 pb-3 last:border-0">
                  <div className="font-medium">{s.title} — {s.start_time && new Date(s.start_time).toLocaleString()}</div>
                  {s.meeting_url ? (
                    <a href={s.meeting_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-xs hover:underline block mt-1">🔗 Join meeting</a>
                  ) : null}
                  {editingLinkSessionId === s.id ? (
                    <div className="mt-2 flex gap-2 flex-wrap items-center">
                      <input
                        type="url"
                        placeholder="Paste Zoom / Meet link"
                        value={editingLinkValue}
                        onChange={(e) => setEditingLinkValue(e.target.value)}
                        className="flex-1 min-w-[200px] border rounded px-2 py-1 text-sm"
                      />
                      <button type="button" onClick={() => saveSessionMeetingLink(s.id)} disabled={linkSaving} className="bg-pink-600 text-white px-3 py-1 rounded text-sm">Save</button>
                      <button type="button" onClick={() => { setEditingLinkSessionId(null); setEditingLinkValue(""); }} className="text-gray-500 text-sm">Cancel</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => { setEditingLinkSessionId(s.id); setEditingLinkValue(s.meeting_url || ""); }} className="text-gray-500 text-xs mt-1 hover:underline">
                      {s.meeting_url ? "Edit link" : "+ Add meeting link"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <form onSubmit={addSession} className="space-y-2">
              <input
                type="text"
                placeholder="Session title"
                value={newSession.title}
                onChange={(e) => setNewSession((p) => ({ ...p, title: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={newSession.description}
                onChange={(e) => setNewSession((p) => ({ ...p, description: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                rows={2}
              />
              <div className="flex gap-2 flex-wrap">
                <input
                  type="datetime-local"
                  placeholder="Start"
                  value={newSession.start_time}
                  onChange={(e) => setNewSession((p) => ({ ...p, start_time: e.target.value }))}
                  className="border rounded px-3 py-2"
                  required
                />
                <input
                  type="datetime-local"
                  placeholder="End"
                  value={newSession.end_time}
                  onChange={(e) => setNewSession((p) => ({ ...p, end_time: e.target.value }))}
                  className="border rounded px-3 py-2"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Room (optional)"
                value={newSession.room}
                onChange={(e) => setNewSession((p) => ({ ...p, room: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="url"
                placeholder="Zoom / Meet / Teams link (optional)"
                value={newSession.meeting_url}
                onChange={(e) => setNewSession((p) => ({ ...p, meeting_url: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              />
              <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded-lg">Add session</button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
