
          



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ParticleExplosion from "../components/ParticleExplosion.jsx";
import Robot3D from "../components/Robot3D.jsx";
import BubbleHeader from "../components/BubbleHeader.jsx"; // bubble overlay header

const Landing = () => {
  const navigate = useNavigate();
  const [explode, setExplode] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* 3D Robot Background */}
      <div className="absolute inset-0 z-10">
        <Robot3D />
      </div>

     
      {/* Explore Button */}
      {!explode && (
        <button
          onClick={() => setExplode(true)}
          className="absolute bottom-[200px] left-1/2 -translate-x-1/2 px-10 py-4 text-xl bg-purple-600 text-white rounded-full z-20"
        >
          Want to Create Your Event?
        </button>
      )}

      {/* Explosion */}
      {explode && (
        <ParticleExplosion
          isActive={explode}
          onComplete={() => setShowAuth(true)}
        />
      )}

      {/* Bubble Login/Signup Overlay */}
      {showAuth && (
        <BubbleHeader
          onLogin={() => navigate("/login")}
          onSignup={() => navigate("/signup")}
        />
      )}
    </div>
  );


 

};

export default Landing;
