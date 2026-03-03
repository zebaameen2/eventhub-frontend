import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const BASE = import.meta.env.VITE_BASE_URL;

export default function SessionChat() {
  const { eventId, sessionId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${BASE}/api/sessions/${sessionId}/chat`);
      const data = await res.json();
      if (res.ok && data.messages) setMessages(data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!sessionId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [chatRes, sessRes] = await Promise.all([
          fetch(`${BASE}/api/sessions/${sessionId}/chat`),
          fetch(`${BASE}/api/events/${eventId}/sessions`).then((r) => r.json()),
        ]);
        const chatData = await chatRes.json();
        if (chatRes.ok && chatData.messages) setMessages(chatData.messages);
        if (sessRes.sessions) {
          const s = sessRes.sessions.find((x) => x.id === sessionId);
          if (s) setSession(s);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId, sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in to chat");
      return;
    }
    if (!input.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${BASE}/api/sessions/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ body: input.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setInput("");
      } else {
        alert(data.error || "Failed to send");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header eventId={eventId} />
        <div className="md:ml-64 ml-0 pt-20 flex justify-center py-12">Loading chat...</div>
      </>
    );
  }

  return (
    <>
      <Header eventId={eventId} />
      <div className="fixed top-4 right-4 z-40 hidden md:block">
        <button type="button" onClick={() => navigate(`/events/${eventId}/schedule`)} className="bg-pink-600 text-white px-4 py-2 rounded-full shadow-md">
          Back to Schedule
        </button>
      </div>
      <div className="md:ml-64 ml-0 pt-20 min-h-screen bg-gray-50 flex flex-col">
        <div className="p-4 border-b bg-white">
          <h1 className="text-xl font-bold">{session?.title || "Session"} – Chat</h1>
          <button type="button" onClick={() => navigate(`/events/${eventId}/schedule`)} className="text-pink-600 hover:underline text-sm md:hidden">← Schedule</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No messages yet. Say hello!</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="bg-white rounded-lg px-3 py-2 shadow-sm max-w-[85%]">
                <p className="text-sm font-medium text-gray-700">
                  {m.users ? `${m.users.firstname || ""} ${m.users.lastname || ""}`.trim() || "User" : "User"}
                </p>
                <p className="text-gray-900">{m.body}</p>
                <p className="text-gray-400 text-xs mt-1">{m.created_at && new Date(m.created_at).toLocaleTimeString()}</p>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={sendMessage} className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
              maxLength={2000}
            />
            <button type="submit" disabled={sending || !input.trim()} className="bg-pink-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
