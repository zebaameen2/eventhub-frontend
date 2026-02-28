import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={() => {
        if (!event || !event.id) {
          console.warn("EventCard clicked but event.id is missing", event);
          return;
        }
        navigate(`/events/${event.id}`);
      }}
    >
      {/* Image */}
      {event.banner_url || event.card_url ? (
        <img
          src={event.banner_url || event.card_url}
          alt={event.eventname}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h2 className="text-lg font-bold text-gray-800 truncate">
          {event.eventname}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Type: {event.type}</p>
        <p className="text-sm text-gray-500">Audience: {event.audience}</p>

        {/* Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent card click conflict
            if (!event || !event.id) {
              console.warn("View Details clicked but event.id missing", event);
              return;
            }
            navigate(`/events/${event.id}`);
          }}
          className="mt-4 w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
