// // src/components/ProtectedRoute.jsx
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ children }) {
//   const { user } = useAuth();

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }


import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const [valid, setValid] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setValid(false);
      return;
    }

    // verify token with backend
    fetch(`${import.meta.env.VITE_BASE_URL}/api/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setValid(res.ok))
      .catch(() => setValid(false));
  }, []);

  if (valid === null) {
    return <div>Loading...</div>;
  }

  if (!user || !valid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
