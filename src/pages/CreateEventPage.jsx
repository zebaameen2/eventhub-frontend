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
          className="bg-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition"
        >
          My Profile
        </button>
      </div>
      <div className="md:ml-64 ml-0 pt-20 p-6 md:p-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Create Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          {/* Event Fields */}

          <input type="text" name="eventname" placeholder="Event Name" value={eventData.eventname} onChange={handleChange} className="border p-2 w-full rounded" />

          <textarea name="description" placeholder="Description" value={eventData.description} onChange={handleChange} className="border p-2 w-full rounded" />

          <input type="text" name="hostname" placeholder="Host Name" value={eventData.hostname} onChange={handleChange} className="border p-2 w-full rounded" />
          <select name="type" value={eventData.type} onChange={handleChange} className="border p-2 w-full rounded" > <option value="">Select Event Type</option>
            <option value="In-Person">In-Person</option>
            <option value="Online">Online (Meet)</option>

          </select> <input type="date" name="eventdate" value={eventData.eventdate} onChange={handleChange} className="border p-2 w-full rounded" />

          <input type="email" name="email" placeholder="Contact Email" value={eventData.email} onChange={handleChange} className="border p-2 w-full rounded" />

          <input type="text" name="city" placeholder="City" value={eventData.city} onChange={handleChange} className="border p-2 w-full rounded" />

          <input type="text" name="state" placeholder="State" value={eventData.state} onChange={handleChange} className="border p-2 w-full rounded" />

          <input type="text" name="audience" placeholder="audience type" value={eventData.audience} onChange={handleChange} className="border p-2 w-full rounded" />

          <input type="number" name="price" placeholder="Ticket Price" value={eventData.price} onChange={handleChange} className="border p-2 w-full rounded" /> {/* Banner Image */} <div> <label className="font-semibold">Banner Image</label>

            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "banner")} className="border p-2 w-full rounded" /> {bannerPreview && (<img src={bannerPreview} alt="Banner Preview" className="mt-2 w-full h-48 object-cover rounded" />)} </div> {/* Card Image */} <div> <label className="font-semibold">Card Image</label>

            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "card")} className="border p-2 w-full rounded" /> {cardPreview && (<img src={cardPreview} alt="Card Preview" className="mt-2 w-48 h-28 object-cover rounded" />)} </div>

          {/* Sponsors */}
          <div> <h2 className="text-xl font-semibold">Sponsors</h2> {sponsors.map((sponsor, index) => (<div key={sponsor.id} className="flex gap-2 mt-2">

            <input type="text" placeholder="Sponsor Name" value={sponsor.name} onChange={(e) => handleSponsorChange(index, "name", e.target.value)} className="border p-2 rounded" />

            <input type="text" placeholder="Sponsor URL" value={sponsor.url} onChange={(e) => handleSponsorChange(index, "url", e.target.value)} className="border p-2 rounded" />
          </div>))}

            <button type="button" onClick={handleAddSponsor} className="bg-gray-300 px-3 py-1 mt-2 rounded" > Add Sponsor </button>

          </div> {/* Approval */} <div className="flex items-center gap-2">
            <input type="checkbox" checked={approval} onChange={() => setApproval(!approval)} /> <label>Request Approval</label> </div> <button type="submit" className="bg-black text-white px-5 py-2 rounded" > Create Event </button> </form> </div> </>);
};

export default CreateEventPage;