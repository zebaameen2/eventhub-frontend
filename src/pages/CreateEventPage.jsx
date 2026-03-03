import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { supabase } from "../supabaseClient";
import Dashboard from "./Dashboard";



const CreateEventPage = () => {
  const navigate = useNavigate();



  // ✅ GET USER FROM LOCAL STORAGE
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const [eventData, setEventData] = useState({
    eventname: "",
    description: "",
    hostname: "",
    eventdate: "",
    email: "",
    country: "",
    address: "",
    city: "",
    state: "",
    postal: "",
    audience: "",
    type: "",
    attendees: "",
    price: "",
    tech: "",
    agenda: "",
    twitter: "",
    website: "",
    linkedin: "",
    instagram: "",
  });

  const [sponsors, setSponsors] = useState([]);
  const [approval, setApproval] = useState(false);

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [cardFile, setCardFile] = useState(null);
  const [cardPreview, setCardPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSponsor = () => {
    setSponsors([...sponsors, { id: Date.now(), name: "", url: "" }]);
  };

  const handleSponsorChange = (index, field, value) => {
    const updated = [...sponsors];
    updated[index][field] = value;
    setSponsors(updated);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "banner") {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    } else {
      setCardFile(file);
      setCardPreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Safety check
    if (!user?.id) {
      alert("User not logged in");
      return;
    }

    const formDataToSend = new FormData();

    Object.keys(eventData).forEach((key) =>
      formDataToSend.append(key, eventData[key])
    );

    formDataToSend.append("sponsors", JSON.stringify(sponsors));
    formDataToSend.append("approval", approval);

    console.log("USER FROM LOCALSTORAGE:", user);
    console.log("USER ID:", user?.id);
    formDataToSend.append("created_by", user.id);

    if (bannerFile) formDataToSend.append("banner", bannerFile);
    if (cardFile) formDataToSend.append("card", cardFile);

    try {
      const token = localStorage.getItem("token"); // 🔒 get token

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // 🔒 send token
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (data.success) {
        alert("Event created successfully 🎉");
        navigate("/events");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };


  return (
    <>
      <Dashboard />
      <div className="fixed top-4 right-4 z-40 hidden md:block">
        <button
          onClick={() => navigate("/profile")}
          className="bg-[#f02e65] hover:bg-[#d91e52] text-white px-4 py-2 rounded-xl font-medium shadow-sm transition"
        >
          My Profile
        </button>
      </div>
      <div className="md:ml-64 ml-0 pt-20 p-6 md:p-10 bg-gray-50/80 min-h-screen pb-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Event</h1>
          <p className="text-gray-500 mb-8">Fill in the details below</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <input type="text" name="eventname" placeholder="Event Name" value={eventData.eventname} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" required />
              <textarea name="description" placeholder="Description" value={eventData.description} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none resize-none" rows={3} />
              <input type="text" name="hostname" placeholder="Host Name" value={eventData.hostname} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" />
              <select name="type" value={eventData.type} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none">
                <option value="">Select Event Type</option>
                <option value="In-Person">In-Person</option>
                <option value="Online">Online</option>
              </select>
              <input type="date" name="eventdate" value={eventData.eventdate} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" />
              <input type="email" name="email" placeholder="Contact Email" value={eventData.email} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="city" placeholder="City" value={eventData.city} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" />
                <input type="text" name="state" placeholder="State" value={eventData.state} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" />
              </div>
              <input type="text" name="audience" placeholder="Audience type" value={eventData.audience} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" />
              <input type="number" name="price" placeholder="Ticket Price" value={eventData.price} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <label className="block text-sm font-medium text-gray-700">Banner Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "banner")} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gray-100 file:font-medium file:text-gray-700" />
              {bannerPreview && <img src={bannerPreview} alt="Banner" className="mt-2 w-full h-40 object-cover rounded-xl" />}
              <label className="block text-sm font-medium text-gray-700 pt-2">Card Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "card")} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gray-100 file:font-medium file:text-gray-700" />
              {cardPreview && <img src={cardPreview} alt="Card" className="mt-2 w-48 h-28 object-cover rounded-xl" />}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sponsors</h2>
              {sponsors.map((sponsor, index) => (
                <div key={sponsor.id} className="flex gap-3 mb-3">
                  <input type="text" placeholder="Sponsor Name" value={sponsor.name} onChange={(e) => handleSponsorChange(index, "name", e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" />
                  <input type="text" placeholder="URL" value={sponsor.url} onChange={(e) => handleSponsorChange(index, "url", e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" />
                </div>
              ))}
              <button type="button" onClick={handleAddSponsor} className="text-[#f02e65] font-medium hover:underline">+ Add Sponsor</button>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="approval" checked={approval} onChange={() => setApproval(!approval)} className="rounded border-gray-300 text-[#f02e65] focus:ring-[#f02e65]" />
              <label htmlFor="approval" className="text-gray-700">Request approval for registrations</label>
            </div>
            <button type="submit" className="w-full bg-[#f02e65] hover:bg-[#d91e52] text-white py-3 rounded-xl font-medium shadow-sm transition">
              Create Event
            </button>
          </form>
        </div>
      </div> </>);
};

export default CreateEventPage;