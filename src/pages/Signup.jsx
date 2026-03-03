















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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 text-sm mb-6">Sign up to get started</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="firstname" placeholder="First name" value={formData.firstname} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" />
              <input name="lastname" placeholder="Last name" value={formData.lastname} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" />
            </div>
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" />
            <div className="grid grid-cols-2 gap-4">
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" />
              <input type="password" name="confirmPassword" placeholder="Confirm" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f02e65]/20 focus:border-[#f02e65] outline-none" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl bg-[#f02e65] hover:bg-[#d91e52] text-white font-medium transition disabled:opacity-60">
              {isLoading ? "Creating..." : "Sign up"}
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-gray-500">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")} className="text-[#f02e65] font-medium hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
