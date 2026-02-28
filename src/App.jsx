
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetails from "./pages/EventDetails";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import EventsList from "./pages/EventsList.jsx";
import SuccessReg from "./pages/SuccessReg.jsx";
import SignUp from "./pages/Signup.jsx";
import MyEvents from "./pages/MyEvents";
import EventStats from "./pages/EventStats";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import MyProfile from "./pages/MyProfile.jsx"
import DashBoardContent from "./pages/DashBoardContent.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <><Header /><CreateEventPage /></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <><Header /><EventsList /></>
              </ProtectedRoute>
            }
          />
          {/* registration thank‑you page must come before the dynamic eventId route to
              avoid accidental matching by :eventId.  Renamed from "/events/successreg"
              to a less collision‑prone URL. */}
          <Route
            path="/events/registration-success"
            element={
              <ProtectedRoute>
                <><Header /><SuccessReg /></>
              </ProtectedRoute>
            }
          />
          {/* keep old path around with a redirect just in case someone has bookmarks */}
          <Route
            path="/events/successreg"
            element={<Navigate to="/events/registration-success" replace />}
          />
          <Route
            path="/events/:eventId"
            element={
              <ProtectedRoute>
                <><Header /><EventDetails /></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <><Header /><DashBoardContent/> </>
              </ProtectedRoute>
            }
          />
          

          <Route
            path="/events/:id/stats"
            element={
              <ProtectedRoute>
                <><Header /><EventStats /></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/myevents"
            element={
              <ProtectedRoute>
                <><Header /><MyEvents /></>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={<ProtectedRoute>
              <><Header /><MyProfile /></>
            </ProtectedRoute>} />

          <Route
            path="/stats/:event"
            element={
              <ProtectedRoute>
                <><Header /><EventStats /></>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
