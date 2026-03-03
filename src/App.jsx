
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FloatingParticles from "./components/FloatingParticles";
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
import EventSchedule from "./pages/EventSchedule";
import EventManage from "./pages/EventManage";
import EventAnnouncements from "./pages/EventAnnouncements";
import EventPolls from "./pages/EventPolls";
import EventQA from "./pages/EventQ&A";
import SessionChat from "./pages/SessionChat";
import EventFeedback from "./pages/EventFeedback";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import MyProfile from "./pages/MyProfile.jsx"
import DashBoardContent from "./pages/DashBoardContent.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProductViewerPage from "./pages/ProductViewerPage";

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
            path="/events/:eventId/schedule"
            element={
              <ProtectedRoute>
                <><Header /><EventSchedule /></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId/manage"
            element={
              <ProtectedRoute>
                <><Header /><EventManage /></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId/announcements"
            element={
              <ProtectedRoute>
                <><Header /><EventAnnouncements /></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId/polls"
            element={
              <ProtectedRoute>
                <><Header /><EventPolls /></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId/qna"
            element={
              <ProtectedRoute>
                <><Header /><EventQA /></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId/session/:sessionId/chat"
            element={
              <ProtectedRoute>
                <><Header /><SessionChat /></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId/feedback"
            element={
              <ProtectedRoute>
                <><Header /><EventFeedback /></>
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
            path="/product-viewer"
            element={<ProductViewerPage />}
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
        <FloatingParticles particleCount={56} zIndex={5} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
