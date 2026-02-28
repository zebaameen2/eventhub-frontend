















// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SignUp = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     firstname: "",
//     lastname: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/signup`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || "Something went wrong");
//       } else {
//         alert("Signup successful!");
//         navigate("/login");
//       }
//     } catch (err) {
//       setError("Server error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

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

//       <div className="min-h-screen flex items-center justify-center"
//            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
//         <div className="relative z-10 w-full max-w-2xl px-6">
//           <div className="card backdrop-blur-xl border border-secondary-500/30 shadow-2xl p-6 md:p-8">
//           <h1 className="text-4xl font-bold text-white mb-6">
//             Create Account
//           </h1>

//           <form onSubmit={handleSubmit} className="grid gap-4">
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 name="firstname"
//                 placeholder="First Name"
//                 onChange={handleChange}
//                 className="input"
//               />
//               <input
//                 name="lastname"
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

//           <p className="mt-6 text-sm text-center text-gray-200">
//             Already have an account?{" "}
//             <button
//               onClick={() => navigate("/login")}
//               className="text-white font-bold underline"
//             >
//               Login
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
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
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/signup`, {
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
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
    >
      <div className="relative z-10 w-full max-w-2xl px-6">
        <div className="card backdrop-blur-xl border border-white/20 shadow-2xl p-8 rounded-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-purple-500/40">
          <h1 className="text-4xl font-extrabold text-white mb-6 animate-fadeIn">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="grid gap-4 animate-fadeIn delay-200">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstname"
                placeholder="First Name"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              <input
                name="lastname"
                placeholder="Last Name"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-purple-600 text-white font-bold shadow-lg hover:bg-purple-700 hover:shadow-purple-500/50 transition transform hover:scale-105"
            >
              {isLoading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-200 animate-fadeIn delay-500">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-white font-bold underline hover:text-purple-300 transition"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
