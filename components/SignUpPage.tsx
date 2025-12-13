import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "./images/Logo.png";

const SignUpPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-up logic here
    console.log({ name, email, password });
    // Navigate to dashboard after sign up
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D7E9F4] relative">
      {/* Home Link - Positioned slightly lower from the top */}
      <Link
        to="/"
        className="absolute top-8 left-4 text-[#3F5ECC] font-semibold text-lg flex items-center gap-2"
      >
        <FaHome size={20} />
        Home
      </Link>

      {/* Sign Up Form Card */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Logo Inside Card (Top Center) */}
        <div className="text-center mb-6">
          <img src={logo} alt="RecAi Logo" className="h-14 mx-auto" />
        </div>

        <h2 className="text-3xl font-bold text-[#3F5ECC] text-center mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                id="name"
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3F5ECC]"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                id="email"
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3F5ECC]"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                id="password"
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3F5ECC]"
                placeholder="Create your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-[#3F5ECC] text-white font-semibold py-3 rounded-lg hover:bg-[#1A4D98] transition duration-200"
          >
            Sign Up
          </button>

          {/* Login Redirect */}
          <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-[#3F5ECC] hover:text-[#1A4D98]">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
