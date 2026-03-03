import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const BASE = import.meta.env.VITE_BASE_URL;

export default function EventPolls() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [votedIds, setVotedIds] = useState(new Set());
  const [resultsCache, setResultsCache] = useState({});

  const userInfo = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userInfo") || "{}") : {};
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!eventId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pRes, eRes] = await Promise.all([
          fetch(`${BASE}/api/events/${eventId}/polls`),
          fetch(`${BASE}/api/events/${eventId}`),
        ]);
        const pData = await pRes.json();
        const eData = await eRes.json();
        if (pRes.ok && pData.polls) setPolls(pData.polls);
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

  const addOption = () => setOptions((p) => [...p, ""]);
  const setOption = (i, v) => setOptions((p) => {
    const next = [...p];
    next[i] = v;
    return next;
  });

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in");
      return;
    }
    const opts = options.map((o) => o.trim()).filter(Boolean);
    if (opts.length < 2) {
      alert("Add at least 2 options");
      return;
    }
    try {
      const res = await fetch(`${BASE}/api/events/${eventId}/polls`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: question.trim(), options: opts }),
      });
      const data = await res.json();
      if (res.ok && data.poll) {
        setPolls((prev) => [data.poll, ...prev]);
        setQuestion("");
        setOptions(["", ""]);
        setShowForm(false);
      } else {
        alert(data.error || "Failed to create poll");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setPollStatus = async (pollId, status) => {
    if (!token) return;
    try {
      const res = await fetch(`${BASE}/api/events/${eventId}/polls/${pollId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok && data.poll) {
        setPolls((prev) => prev.map((p) => (p.id === pollId ? data.poll : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResults = async (pollId) => {
    try {
      const res = await fetch(`${BASE}/api/events/${eventId}/polls/${pollId}/results`);
      const data = await res.json();
      if (res.ok && data.poll) setResultsCache((c) => ({ ...c, [pollId]: data.poll }));
    } catch (err) {
      console.error(err);
    }
  };

  const vote = async (pollId, optionIndex) => {
    if (!token) {
      alert("Please log in to vote");
      return;
    }
    try {
      const res = await fetch(`${BASE}/api/events/${eventId}/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ option_index: optionIndex }),
      });
      const data = await res.json();
      if (res.ok) {
        setVotedIds((prev) => new Set(prev).add(pollId));
        fetchResults(pollId);
      } else {
        alert(data.error || "Could not vote");
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">{event?.eventname || "Event"} – Polls</h1>
          <button type="button" onClick={() => navigate(`/events/${eventId}`)} className="text-pink-600 hover:underline mb-6 md:hidden">← Back</button>

          {isHost && (
            <div className="mb-6">
              {!showForm ? (
                <button type="button" onClick={() => setShowForm(true)} className="bg-pink-600 text-white px-4 py-2 rounded-lg">New poll</button>
              ) : (
                <form onSubmit={handleCreatePoll} className="bg-white rounded-xl p-4 shadow space-y-3">
                  <input
                    type="text"
                    placeholder="Question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  {options.map((o, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={o}
                      onChange={(e) => setOption(i, e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  ))}
                  <button type="button" onClick={addOption} className="text-sm text-pink-600">+ Add option</button>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded-lg">Create poll</button>
                    <button type="button" onClick={() => setShowForm(false)} className="border px-4 py-2 rounded-lg">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {polls.length === 0 ? (
            <p className="text-gray-500">No polls yet.</p>
          ) : (
            <ul className="space-y-6">
              {polls.map((poll) => {
                const results = resultsCache[poll.id];
                const hasVoted = votedIds.has(poll.id);
                const isLive = poll.status === "live";

                return (
                  <li key={poll.id} className="bg-white rounded-xl p-4 shadow">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="font-bold text-lg">{poll.question}</h2>
                      <span className="text-sm text-gray-500 capitalize">{poll.status}</span>
                    </div>
                    {isHost && poll.status !== "closed" && (
                      <div className="flex gap-2 mb-3">
                        {poll.status === "draft" && (
                          <button type="button" onClick={() => setPollStatus(poll.id, "live")} className="text-sm bg-green-600 text-white px-2 py-1 rounded">Go live</button>
                        )}
                        {poll.status === "live" && (
                          <button type="button" onClick={() => setPollStatus(poll.id, "closed")} className="text-sm bg-gray-600 text-white px-2 py-1 rounded">Close</button>
                        )}
                      </div>
                    )}
                    {!results && (hasVoted || poll.status === "closed") && (
                      <button type="button" onClick={() => fetchResults(poll.id)} className="text-sm text-pink-600">Show results</button>
                    )}
                    {results && (
                      <ul className="space-y-1 mt-2">
                        {(results.results || []).map((r, i) => (
                          <li key={i} className="flex justify-between text-sm">
                            <span>{r.label}</span>
                            <span>{r.count} vote(s)</span>
                          </li>
                        ))}
                        <li className="text-gray-500 text-sm">Total: {results.total_votes} votes</li>
                      </ul>
                    )}
                    {!hasVoted && isLive && !results && (
                      <ul className="space-y-2 mt-3">
                        {(poll.options || []).map((opt, i) => (
                          <li key={i}>
                            <button
                              type="button"
                              onClick={() => vote(poll.id, i)}
                              className="w-full text-left border rounded px-3 py-2 hover:bg-gray-50"
                            >
                              {opt}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
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
