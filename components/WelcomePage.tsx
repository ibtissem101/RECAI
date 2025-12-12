import React from "react";
import { Link } from "react-router-dom";
import {
  FaPaperclip,
  FaChartBar,
  FaComments,
  FaUser,
  FaEnvelope,
  FaComment,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import SplashCursor from "./SplashCursor";
import logo from "./images/logo.png";
import hero from "./images/hero.svg";


const BluePolygonSection: React.FC = () => {
  return (
    <section
      id="services"
      className="relative w-full bg-[#3F5ECC] py-12 md:py-24 lg:py-24 text-white rounded-3xl"
    >
      {/* Title */}
      <div className="flex flex-col items-center text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl">
          All in one proof for final mile delivery solutions
        </h2>
        <div className="mt-4 w-20 h-1 bg-white/90 rounded" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto px-4 md:px-8">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 hover:-translate-y-2 transition duration-300">
          <div className="flex items-center mb-4">
            <div className="bg-[#3F5ECC] text-white p-3 rounded-lg mr-4">
              <FaChartBar />
            </div>
            <h3 className="text-xl font-bold text-gray-900">AI Scoring System</h3>
          </div>
          <p className="text-gray-700 text-sm">
            Evaluates candidates on a 0–100 scale with transparent, explainable reasoning.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 hover:-translate-y-2 transition duration-300">
          <div className="flex items-center mb-4">
            <div className="bg-blue-50 text-[#3F5ECC] p-3 rounded-lg mr-4">
              <FaPaperclip />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Resume Parser</h3>
          </div>
          <p className="text-gray-700 text-sm">
            Extracts skills, education and keywords and transforms resumes into structured JSON.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 hover:-translate-y-2 transition duration-300">
          <div className="flex items-center mb-4">
            <div className="bg-purple-50 text-[#3F5ECC] p-3 rounded-lg mr-4">
              <FaComments />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Communication Drafts</h3>
          </div>
          <p className="text-gray-700 text-sm">
            Generates personalized outreach for updates, invites, and rejections.
          </p>
        </div>
      </div>
    </section>
  );
};

/* ----------------------------------------------------------
   RIGHT SIDE CONTACT INFO — Blue glow 
----------------------------------------------------------- */
const ContactRightPanel: React.FC = () => {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  return (
    <div
      className="relative bg-[#d7e9f4] text-white p-10 md:p-12 flex flex-col justify-center overflow-hidden rounded-r-2xl"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      {/* Blue glow (brand color) */}
      <div
        className="pointer-events-none absolute w-[420px] h-[420px] rounded-full blur-[140px] opacity-70 transition-transform duration-150"
        style={{
          background:
            "radial-gradient(circle, rgba(63,94,204,0.85), rgba(63,94,204,0.45), rgba(63,94,204,0.2), transparent 70%)",
          transform: `translate(${pos.x - 210}px, ${pos.y - 210}px)`,
        }}
      />

      <h3 className="text-4xl font-bold mb-10 relative z-10 text-[#3F5ECC]">
        Contact Information
      </h3>

      <div className="space-y-10 relative z-10 text-black">
        <div className="flex items-start gap-4 group">
          <div className="bg-black/20 p-4 rounded-full shadow-lg group-hover:scale-110 transition">
            <FaPhone className="text-xl" />
          </div>
          <div>
            <p className="font-semibold text-black">Phone</p>
            <p className="text-lg">055555555</p>
          </div>
        </div>

        <div className="flex items-start gap-4 group">
          <div className="bg-black/20 p-4 rounded-full shadow-lg group-hover:scale-110 transition">
            <FaEnvelope className="text-black text-xl" />
          </div>
          <div>
            <p className="font-semibold">Email</p>
            <p className="text-lg">abcdef@gmail.com</p>
          </div>
        </div>

        <div className="flex items-start gap-4 group">
          <div className="bg-black/20 p-4 rounded-full shadow-lg group-hover:scale-110 transition">
            <FaMapMarkerAlt className="text-black text-xl" />
          </div>
          <div>
            <p className="font-semibold">Address</p>
            <p className="text-lg">123, XXX, abc-0000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------
   MAIN PAGE
----------------------------------------------------------- */
const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Header */}
      <header className="bg-white shadow-md py-4 px-8 fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
        <img src={logo} alt="RecAi Logo" className="h-14" />        
          <nav className="hidden md:flex items-center space-x-6 text-[#3F5ECC] font-semibold">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact us</a>
          </nav>

          <div>
            <Link to="/login">
              <button className="bg-white text-[#3F5ECC] border border-[#3F5ECC] font-bold py-3 px-6 rounded-lg mr-4 shadow-sm">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-[#3F5ECC] text-white font-bold py-3 px-6 rounded-lg">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Adds spacing so hero isn’t hidden behind fixed navbar */}
      <div className="h-24" />

      {/* Hero */}
      <section id="home" className="flex items-center justify-between px-8 py-15 ml-20">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-5xl font-bold text-[#3F5ECC] mb-6">
            AI-Powered Recruitment Automation
          </h1>

          <p className="text-xl mb-10 text-gray-600">
            RecAI automates resume screening, candidate research, and interview
            prep — cutting hiring time by 99% and boosting recruitment profit.
          </p>

          <Link to="/signup">
            <button className="bg-[#3F5ECC] text-white font-bold py-4 px-10 rounded-lg shadow-lg">
              Get Started Now
            </button>
          </Link>
        </div>

        <div className="flex-1">
          <img
            src={hero}
            className="w-full max-w-sm"
            alt="AI powered recruitment"
            />

        </div>
      </section>

      {/* Blue Section */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <BluePolygonSection />

        {/* Contact Section */}
        <section
          id="contact"
          className="bg-white rounded-2xl shadow-xl overflow-hidden mt-16 grid grid-cols-1 lg:grid-cols-2"
        >
          {/* Left form */}
          <div className="p-10 md:p-12">
            <h2 className="text-3xl font-bold mb-6 text-[#3F5ECC]">
              Connect with our experts
            </h2>
            <form className="space-y-6">
              <div className="relative">
                <FaUser className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full pl-12 p-4 border rounded-lg focus:border-[#3F5ECC]"
                />
              </div>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Mail"
                  className="w-full pl-12 p-4 border rounded-lg focus:border-[#3F5ECC]"
                />
              </div>

              <div className="relative">
                <FaComment className="absolute left-4 top-4 text-gray-400" />
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full pl-12 p-4 border rounded-lg focus:border-[#3F5ECC]"
                />
              </div>

              <button className="w-full bg-[#3F5ECC] text-white font-bold py-4 rounded-lg">
                Send
              </button>
            </form>
          </div>

          {/* Right interactive panel */}
            <ContactRightPanel />
            <SplashCursor />

          {/* Right interactive panel */}

        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 text-center mt-12">
        © {new Date().getFullYear()} AI-Powered Recruitment Automation.
      </footer>
    </div>
  );
};

export default WelcomePage;
