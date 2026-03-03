import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer group"
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
        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={event.banner_url || event.card_url}
            alt={event.eventname}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-sm font-medium">No image</span>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900 truncate">
          {event.eventname}
        </h2>
        <p className="text-sm text-gray-500 mt-1">{event.type}</p>
        <p className="text-sm text-gray-500">{event.audience}</p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!event?.id) return;
            navigate(`/events/${event.id}`);
          }}
          className="mt-4 w-full bg-[#f02e65] hover:bg-[#d91e52] text-white py-2.5 rounded-xl font-medium transition shadow-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
