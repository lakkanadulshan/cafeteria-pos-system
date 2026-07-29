import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";
import bgImg from "../assets/home.jpg";
import { LogIn, UserPlus, ArrowRight } from "lucide-react";

const Home = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-cover bg-center bg-no-repeat bg-fixed relative selection:bg-amber-100 selection:text-amber-900"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Relative wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* --- 🟢 DARK MATTE NAVIGATION --- */}
        <nav className="fixed top-0 w-full z-[100] bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-xl transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative p-1.5 bg-slate-900 rounded-2xl border border-slate-800 group-hover:border-amber-500/50 transition-colors">
                <img src={logoImg} alt="Bloom Café Logo" className="w-14 h-14 object-contain rounded-xl" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-slate-950 rounded-full"></div>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                bloom cafe<span className="text-amber-400">.</span>
              </span>
            </Link>

            <div className="flex items-center gap-8">
              <Link to="/login" className="text-sm font-black uppercase tracking-[0.15em] text-slate-300 hover:text-amber-300 flex items-center gap-2 transition-colors">
                <LogIn size={16} className="text-amber-400" /> Sign In
              </Link>
              <Link to="/register" className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10 active:scale-95">
                <UserPlus size={16} /> Register
              </Link>
            </div>
          </div>
        </nav>

        {/* --- 🟢 HERO SECTION (Warm Amber/Gold & Warm Cream Tones) --- */}
        <main className="max-w-5xl mx-auto px-6 pt-48 pb-20 w-full flex-grow text-center animate-in fade-in duration-1000">
          
          {/* Main Heading with Warm Gold Accent */}
          <h1 
            className="text-5xl md:text-7xl font-black text-amber-50 tracking-tight leading-[1.1] mb-8"
            style={{ textShadow: "0 4px 18px rgba(0, 0, 0, 0.9)" }}
          >
            Brew with <br />
            <span className="text-amber-300">confidence.</span>
          </h1>

          {/* Subtitle in Warm Soft Cream */}
          <p 
            className="text-black text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-bold"
            style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.85)" }}
          >
            From every order to every customer, manage your café with speed,
            simplicity, and complete confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {/* Primary Button - Warm Amber Gold */}
            <Link
              to="/login"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-10 py-4 rounded-full shadow-2xl transition-all duration-300 text-sm active:scale-95 flex items-center justify-center gap-2"
              style={{ boxShadow: "0 10px 25px rgba(245, 158, 11, 0.35)" }}
            >
              Explore Dashboard <ArrowRight size={18} className="text-slate-950" />
            </Link>

            {/* Secondary Glass Button */}
            <button
              onClick={scrollToFeatures}
              className="w-full sm:w-auto px-10 py-4 bg-black/40 hover:bg-black/60 text-amber-100 border border-amber-200/20 backdrop-blur-md rounded-full font-extrabold text-sm transition-all duration-300 cursor-pointer active:scale-95"
              style={{ textShadow: "0 2px 6px rgba(0, 0, 0, 0.85)" }}
            >
              Learn More 
            </button>
          </div>

          {/* --- 🟢 FEATURES SECTION (Matching Glassmorphism Theme) --- */}
          <div
            id="features"
            className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-36 text-left pt-8"
          >
            <div className="bg-slate-950/80 p-6 rounded-2xl backdrop-blur-md border border-amber-500/20 shadow-2xl transition-all duration-300 hover:border-amber-400/50">
              <h3 className="text-xl font-black text-amber-300 mb-3">
                Fast Service
              </h3>
              <p className="text-amber-100/80 leading-relaxed text-sm font-medium">
                Take orders quickly, process payments seamlessly, and keep every
                customer moving without delays.
              </p>
            </div>

            <div className="bg-slate-950/80 p-6 rounded-2xl backdrop-blur-md border border-amber-500/20 shadow-2xl transition-all duration-300 hover:border-amber-400/50">
              <h3 className="text-xl font-black text-amber-300 mb-3">
                Live Insights
              </h3>
              <p className="text-slate-100/80 leading-relaxed text-sm font-medium">
                Monitor sales, inventory, and daily performance with accurate
                real-time information.
              </p>
            </div>

            <div className="bg-slate-950/80 p-6 rounded-2xl backdrop-blur-md border border-amber-500/20 shadow-2xl transition-all duration-300 hover:border-amber-400/50">
              <h3 className="text-xl font-black text-amber-300 mb-3">
                Built for Teams
              </h3>
              <p className="text-amber-100/80 leading-relaxed text-sm font-medium">
                Manage staff securely with role-based access and a simple,
                intuitive workflow.
              </p>
            </div>
          </div>
        </main>

        {/* --- 🟢 FOOTER --- */}
        <footer className="max-w-6xl mx-auto w-full py-8 px-6 border-t border-amber-200/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-black/30 backdrop-blur-sm">
          <p 
            className="text-[11px] font-black text-amber-100/80 uppercase tracking-[0.2em]"
            style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)" }}
          >
            © {new Date().getFullYear()} Bloom Café Matrix
          </p>
          <div className="flex gap-8">
            <button 
              className="text-[11px] font-black text-amber-100/80 hover:text-amber-300 uppercase tracking-widest transition-colors cursor-pointer"
              style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)" }}
            >
              Privacy
            </button>
            <button 
              className="text-[11px] font-black text-amber-100/80 hover:text-amber-300 uppercase tracking-widest transition-colors cursor-pointer"
              style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)" }}
            >
              Support
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;