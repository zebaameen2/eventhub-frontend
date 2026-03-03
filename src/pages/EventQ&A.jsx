import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const BASE = import.meta.env.VITE_BASE_URL;

export default function EventQA() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [answeringId, setAnsweringId] = useState(null);
  const [answerText, setAnswerText] = useState("");

  const userInfo = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userInfo") || "{}") : {};
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!eventId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [qRes, eRes] = await Promise.all([
          fetch(`${BASE}/api/events/${eventId}/questions`),
          fetch(`${BASE}/api/events/${eventId}`),
        ]);
        const qData = await qRes.json();
        const eData = await eRes.json();
        if (qRes.ok && qData.questions) setQuestions(qData.questions);
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

  const submitQuestion = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in to ask a question");
      return;
    }
    if (!newQuestion.trim()) return;
    try {
      const res = await fetch(`${BASE}/api/events/${eventId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: newQuestion.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.question) {
        setQuestions((prev) => [data.question, ...prev]);
        setNewQuestion("");
      } else {
        alert(data.error || "Failed to submit");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!token || !answeringId || !answerText.trim()) return;
    try {
      const res = await fetch(`${BASE}/api/events/${eventId}/questions/${answeringId}/answer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answer: answerText.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.question) {
        setQuestions((prev) => prev.map((q) => (q.id === answeringId ? data.question : q)));
        setAnsweringId(null);
        setAnswerText("");
      } else {
        alert(data.error || "Failed to answer");
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
          <h1 className="text-2xl font-bold mb-2">{event?.eventname || "Event"} – Q&A</h1>
          <button type="button" onClick={() => navigate(`/events/${eventId}`)} className="text-pink-600 hover:underline mb-6 md:hidden">← Back</button>

          <form onSubmit={submitQuestion} className="mb-6">
            <textarea
              placeholder="Ask a question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
            />
            <button type="submit" className="mt-2 bg-pink-600 text-white px-4 py-2 rounded-lg">Submit question</button>
          </form>

          {questions.length === 0 ? (
            <p className="text-gray-500">No questions yet.</p>
          ) : (
            <ul className="space-y-4">
              {questions.map((q) => (
                <li key={q.id} className="bg-white rounded-xl p-4 shadow">
                  <p className="font-medium">{q.text}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {q.users ? `${q.users.firstname || ""} ${q.users.lastname || ""}`.trim() : "Anonymous"} · {q.created_at && new Date(q.created_at).toLocaleString()}
                  </p>
                  {q.answer ? (
                    <div className="mt-3 pl-3 border-l-2 border-pink-200">
                      <p className="text-gray-700">{q.answer}</p>
                      <p className="text-gray-400 text-sm mt-1">Answered {q.answered_at && new Date(q.answered_at).toLocaleString()}</p>
                    </div>
                  ) : isHost && (
                    <div className="mt-3">
                      {answeringId === q.id ? (
                        <form onSubmit={submitAnswer}>
                          <textarea
                            placeholder="Your answer..."
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            rows={2}
                          />
                          <div className="flex gap-2 mt-2">
                            <button type="submit" className="bg-pink-600 text-white px-3 py-1 rounded">Post answer</button>
                            <button type="button" onClick={() => { setAnsweringId(null); setAnswerText(""); }} className="border px-3 py-1 rounded">Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <button type="button" onClick={() => setAnsweringId(q.id)} className="text-sm text-pink-600">Answer</button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
