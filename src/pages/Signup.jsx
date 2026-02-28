// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AuthBackground3D from "../components/AuthBackground3D";

// const SignUp = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [bubbles, setBubbles] = useState([]);

//   useEffect(() => {
//     setBubbles(
//       Array.from({ length: 15 }, (_, i) => ({
//         id: i,
//         left: Math.random() * 100,
//         delay: Math.random() * 2,
//         duration: Math.random() * 3 + 3,
//       })),
//     );
//   }, []);

//   const handleChange = (e) => {
//     setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
//   };

//   // const handleSubmit = (e) => {
//   //   e.preventDefault();
//   //   setError("");

//   //   if (formData.password !== formData.confirmPassword) {
//   //     setError("Passwords do not match");
//   //     return;
//   //   }

//   //   setIsLoading(true);

//   //   setTimeout(() => {
//   //     localStorage.setItem("user", JSON.stringify(formData));
//   //     navigate("/dashboard");
//   //   }, 1500);
//   // };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");
//   setIsLoading(true);

//   if (formData.password !== formData.confirmPassword) {
//     setError("Passwords do not match");
//     setIsLoading(false);
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:5000/api/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.error || "Something went wrong");
//     } else {
//       alert("Signup successful!");
//       navigate("/login");
//     }
//   } catch (err) {
//     setError("Server error");
//   } finally {
//     setIsLoading(false);
//   }
// };

//   return (
//     <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
//       {/* 🌊 3D BACKGROUND */}
//       <AuthBackground3D />

//       {bubbles.map((b) => (
//         <div
//           key={b.id}
//           className="absolute rounded-full border border-secondary-500/30 bg-secondary-500/5 opacity-30 pointer-events-none"
//           style={{
//             width: Math.random() * 200 + 80,
//             height: Math.random() * 200 + 80,
//             left: b.left + "%",
//             bottom: "-200px",
//             animation: `floatUp ${b.duration}s ease-in infinite`,
//             animationDelay: b.delay + "s",
//           }}
//         />
//       ))}

//       <div className="relative z-10 w-full max-w-2xl px-6">
//         <div className="card backdrop-blur-xl border border-secondary-500/30 shadow-2xl">
//           <h1 className="text-4xl font-bold gradient-text mb-6">
//             Create Account
//           </h1>

//           <form onSubmit={handleSubmit} className="grid gap-4">
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 name="firstName"
//                 placeholder="First Name"
//                 onChange={handleChange}
//                 className="input"
//               />
//               <input
//                 name="lastName"
//                 placeholder="Last Name"
//                 onChange={handleChange}
//                 className="input"
//               />
//             </div>

//             <input
//               name="email"
//               placeholder="Email"
//               onChange={handleChange}
//               className="input"
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 onChange={handleChange}
//                 className="input"
//               />
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm Password"
//                 onChange={handleChange}
//                 className="input"
//               />
//             </div>

//             {error && <div className="text-red-400 text-sm">{error}</div>}

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="btn-primary w-full"
//             >
//               {isLoading ? "Creating..." : "Sign Up"}
//             </button>
//           </form>

//           <p className="mt-6 text-sm text-center text-gray-400">
//             Already have an account?{" "}
//             <button
//               onClick={() => navigate("/login")}
//               className="text-secondary-400 font-bold"
//             >
//               Login
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;
















import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        alert("Signup successful!");
        navigate("/login");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:ml-64 ml-0">
      <div className="fixed top-4 right-4 z-40 hidden md:block">
        <button
          onClick={() => window.location.assign('/profile')}
          className="bg-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition"
        >
          My Profile
        </button>
      </div>

      <div className="min-h-screen flex items-center justify-center"
           style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
        <div className="relative z-10 w-full max-w-2xl px-6">
          <div className="card backdrop-blur-xl border border-secondary-500/30 shadow-2xl p-6 md:p-8">
          <h1 className="text-4xl font-bold text-white mb-6">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstname"
                placeholder="First Name"
                onChange={handleChange}
                className="input"
              />
              <input
                name="lastname"
                placeholder="Last Name"
                onChange={handleChange}
                className="input"
              />
            </div>

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="input"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="input"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="input"
              />
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-200">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-white font-bold underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
  );
};

export default SignUp;
