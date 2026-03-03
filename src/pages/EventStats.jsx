




import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CsvDownloader from "react-csv-downloader";
import Header from "../components/Header";

export default function EventStats() {
  // the route defines either `:id` or `:event` depending on where it's used
  const { event, id } = useParams();
  const eventId = event || id; // normalize

  const [docs, setDocs] = useState([]);
  const [eventData, setEventData] = useState(null);

  // Loading: which registration is being accepted/rejected (regId or null)
  const [pendingAction, setPendingAction] = useState(null); // e.g. 'accept:regId' or 'reject:regId'

  // short-lived toast message
  const [toast, setToast] = useState(null);
  const showToast = (msg, ms = 2500) => {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  };

  // ✅ Email API (uses local dev endpoint when on localhost)
  const callAPI = async (email, subject, message) => {
    const url = window.location.hostname.includes("localhost")
      ? `${import.meta.env.VITE_BASE_URL}/api/send-email`
      : "https://send-grid-api.vercel.app/sendemail";

    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ email, subject, message }),
        headers: { "content-type": "application/json" },
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.warn("Email API returned non-OK status:", res.status, body);
        return false;
      }
      return true;
    } catch (err) {
      console.warn("Email API error:", err.message || err);
      return false;
    }
  };

  // ✅ CSV Export
  const asyncFnComputeDate = () => {
    const data = docs.map((doc) => ({
      name: `${doc.users?.firstname || ""} ${doc.users?.lastname || ""}`.trim(),
      email: doc.users?.email,
    }));
    return Promise.resolve(data);
  };

  // ✅ Fetch registrations + event info from backend
  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${eventId}/registrations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      // debug: log backend response so we can see why the table is empty
      console.log("REGISTRATIONS FETCH RESULT", { eventId, ok: res.ok, result });

      if (result.success) {
        setDocs(result.registrations || []);
        setEventData(result.event || null);
      } else {
        setDocs([]);
      }
    } catch (err) {
      console.error("Error fetching stats:", err.message);
      setDocs([]);
    }
  };

  useEffect(() => {
    if (!eventId) return;
    fetchRegistrations();
  }, [eventId]);

  // ✅ Accept attendee
  const handleAcceptanceEmail = async (regId, name, email, eventName) => {
    const token = localStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_BASE_URL;
    console.log("[Accept] clicked", { regId, baseUrl, hasToken: !!token });

    if (!token) {
      showToast("Please log in again");
      return;
    }
    setPendingAction(`accept:${regId}`);
    try {
      const url = `${baseUrl}/api/registrations/${regId}/accept`;
      console.log("[Accept] fetching", url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (_) {
        console.warn("[Accept] response not JSON", text?.slice(0, 200));
      }
      console.log("[Accept] response", { status: res.status, ok: res.ok, data, textPreview: text?.slice(0, 150) });

      if (!res.ok) {
        const msg = res.status === 401 ? "Please log in again" : (data?.error || data?.message || res.statusText);
        showToast(`Error: ${msg}`);
        return;
      }

      const idStr = String(regId);
      setDocs((d) => d.map((r) => (String(r.id) === idStr ? { ...r, confirm: "accept" } : r)));
      showToast(`Accepted — email sent to ${email}`);
      console.log("[Accept] UI updated for regId", regId);

      const subject = `Accepted for ${eventName || "your event"}`;
      const message = `Hello ${name},\n\nYou have been accepted for ${eventName || "the event"}.\n\nSee you there!`;
      callAPI(email, subject, message);
    } catch (err) {
      if (err.name === "AbortError") {
        console.warn("[Accept] request timed out (server may be waking up)");
        showToast("Server is waking up. Wait 30 seconds and try again.");
      } else {
        console.error("[Accept] error", err);
        showToast("Could not communicate with server");
      }
    } finally {
      setPendingAction(null);
    }
  };

  // 📦 Delete registration (trash icon)
  const handleDeleteRegistration = async (regId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please log in again");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/registrations/${regId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(data?.error || data?.message || `Error: ${res.statusText}`);
        return;
      }
      const idStr = String(regId);
      setDocs((d) => d.filter((r) => String(r.id) !== idStr));
      showToast("Registration removed");
    } catch (err) {
      console.error("Network error deleting registration", err);
      showToast("Could not communicate with server");
    }
  };

  // ✅ Reject attendee (backend deletes the registration; frontend removes row)
  const handleRejectionEmail = async (regId, name, email, eventName) => {
    const token = localStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_BASE_URL;
    console.log("[Reject] clicked", { regId, baseUrl, hasToken: !!token });

    if (!token) {
      showToast("Please log in again");
      return;
    }
    setPendingAction(`reject:${regId}`);
    try {
      const url = `${baseUrl}/api/registrations/${regId}/reject`;
      console.log("[Reject] fetching", url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (_) {
        console.warn("[Reject] response not JSON", text?.slice(0, 200));
      }
      console.log("[Reject] response", { status: res.status, ok: res.ok, data, textPreview: text?.slice(0, 150) });

      if (!res.ok) {
        const msg = res.status === 401 ? "Please log in again" : (data?.error || data?.message || res.statusText);
        showToast(`Error: ${msg}`);
        return;
      }

      const idStr = String(regId);
      setDocs((d) => d.filter((r) => String(r.id) !== idStr));
      showToast(`Rejected — email sent to ${email}`);
      console.log("[Reject] row removed for regId", regId);

      const subject = `Update on ${eventName || "your event"}`;
      const message = `Hello ${name},\n\nUnfortunately your registration for ${eventName || "the event"} was not accepted.\n\nThank you for your interest.`;
      callAPI(email, subject, message);
    } catch (err) {
      if (err.name === "AbortError") {
        console.warn("[Reject] request timed out (server may be waking up)");
        showToast("Server is waking up. Wait 30 seconds and try again.");
      } else {
        console.error("[Reject] error", err);
        showToast("Could not communicate with server");
      }
    } finally {
      setPendingAction(null);
    }
  };


  return (
    <>
      <Header eventId={eventId} showViewStats={true} />
      <div className="fixed top-4 right-4 z-40 hidden md:block">
        <button
          onClick={() => window.location.assign('/profile')}
          className="bg-[#f02e65] hover:bg-[#d91e52] text-white px-4 py-2 rounded-xl font-medium shadow-sm transition"
        >
          My Profile
        </button>
      </div>
      <div className="md:ml-64 ml-0 pt-16">
      {/* Toast: center-top, high z-index so it's always visible */}
      {toast && (
        <div className="fixed left-1/2 top-20 -translate-x-1/2 z-[100] bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg text-center min-w-[280px] max-w-[90vw]">
          {toast}
        </div>
      )}
      <div className="flex justify-center w-full">
      <div className="w-full max-w-6xl px-4 md:px-6 py-8 md:py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Event Attendees</h1>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {docs.map((attendee) => (
                <tr key={attendee.id} className="border-t">
                  <td className="p-3">{`${attendee.users?.firstname || ""} ${attendee.users?.lastname || ""}`.trim()}</td>
                  <td>{attendee.users?.email}</td>

                  <td className="text-center space-x-2">
                    {attendee.confirm === "accept" || attendee.confirm === "accepted" ? (
                      <span className="text-green-600 font-semibold">Accepted</span>
                    ) : attendee.confirm === "reject" || attendee.confirm === "rejected" ? (
                      <span className="text-red-600 font-semibold">Rejected</span>
                    ) : (
                      <>
                        <button
                          className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                          disabled={!!pendingAction}
                          onClick={() =>
                            handleAcceptanceEmail(
                              attendee.id,
                              `${attendee.users?.firstname || ""} ${attendee.users?.lastname || ""}`.trim(),
                              attendee.users?.email,
                              eventData?.eventname
                            )
                          }
                        >
                          {pendingAction === `accept:${attendee.id}` ? "Accepting…" : "Accept"}
                        </button>

                        <button
                          className="bg-red-600 text-white px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                          disabled={!!pendingAction}
                          onClick={() =>
                            handleRejectionEmail(
                              attendee.id,
                              `${attendee.users?.firstname || ""} ${attendee.users?.lastname || ""}`.trim(),
                              attendee.users?.email,
                              eventData?.eventname
                            )
                          }
                        >
                          {pendingAction === `reject:${attendee.id}` ? "Rejecting…" : "Reject"}
                        </button>
                      </>
                    )}

                    <button
                      className="text-gray-500 hover:text-red-600 ml-2"
                      title="Remove registration"
                      onClick={() => handleDeleteRegistration(attendee.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center">
          <CsvDownloader
            datas={asyncFnComputeDate}
            filename="registrations"
            text="Export CSV"
          />
        </div>
      </div>
    </div>
  </div>
  </>
  );
}
