// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";


// const Login = () => {
//   const navigate = useNavigate();
//   const { setUser } = useAuth();


//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);



//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     if (!formData.email || !formData.password) {
//       setError("Please fill in all fields");
//       setIsLoading(false);
//       return;
//     }

//     console.log("Form submitted");

    
//     try {
//       const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await res.json();

//       console.log("STATUS:", res.status);
//       console.log("OK?", res.ok);
//       console.log("DATA:", data);

//       console.log("FULL LOGIN RESPONSE:", data);

//       if (!res.ok) {
//         setError(data.error || "Login failed");
//         return
//       } else {

//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userInfo", JSON.stringify(data.user));

//         setUser(data.user);   //  VERY IMPORTANT

//         console.log("Setting user:", data.user);
//         console.log("Navigating to dashboard...");

//         navigate("/dashboard");
//         console.log("after navigate")
//       }

//     } catch (err) {
//       setError("Server error");
//     } finally {
//       setIsLoading(false);
//     }
//   }
 


//   return (
//     <div className="md:ml-64 ml-0">
//       {/* <div className="fixed top-4 right-4 z-40 hidden md:block">
//         <button
//           onClick={() => window.location.assign('/profile')}
//           className="bg-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition"
//         >
//           My Profile
//         </button>
//       </div> */}

//       <div
//         className="min-h-screen flex items-center justify-center"
//         style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
//       >
//         <div className="relative z-10 w-full max-w-md px-6">
//           <div className="card backdrop-blur-xl border border-primary-500/30 shadow-2xl p-6">
//           <h1 className="text-4xl font-bold text-white mb-4">
//             Welcome Back
//           </h1>
//           <p className="text-gray-200 mb-6">
//             Demo: demo@example.com / demo123
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <input
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Email"
//               className="input"
//             />

//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Password"
//               className="input"
//             />

//             {error && <div className="text-red-400 text-sm">{error}</div>}

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="btn-primary w-full"
//             >
//               {isLoading ? "Logging in..." : "Login"}
//             </button>
//           </form>

//           <p className="mt-6 text-sm text-center text-gray-200">
//             Don’t have an account?{" "}
//             <button
//               onClick={() => navigate("/signup")}
//               className="text-white font-bold underline"
//             >
//               Sign up
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
//   );
// };

// export default Login;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      setUser(data.user);

      navigate("/dashboard");
    } catch (err) {
      setError("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
    >
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="card backdrop-blur-xl border border-white/20 shadow-2xl p-8 rounded-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-purple-500/40">
          <h1 className="text-4xl font-extrabold text-white mb-4 animate-fadeIn">
            Welcome Back
          </h1>
          <p className="text-gray-200 mb-6 animate-fadeIn delay-200">
            Demo: demo@example.com / demo123
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn delay-300">
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-purple-600 text-white font-bold shadow-lg hover:bg-purple-700 hover:shadow-purple-500/50 transition transform hover:scale-105"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-200 animate-fadeIn delay-500">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-white font-bold underline hover:text-purple-300 transition"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
