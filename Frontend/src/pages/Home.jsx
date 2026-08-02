import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";
import {
  LogIn,
  UserPlus,
  ArrowRight,
  Coffee,
  Sparkles,
} from "lucide-react";

const Home = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-slate-900 selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-50/50 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute bottom-[5%] right-[-5%] w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-[100px] pointer-events-none -z-0" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* --- 🟢 NAVIGATION BAR --- */}
        <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100/60">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-4 group">
              <div className="p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm group-hover:border-purple-300 transition-all duration-300">
                <img
                  src={logoImg}
                  alt="Bloom Café Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900 tracking-tighter leading-none uppercase">
                  bloom café<span className="text-purple-600">.</span>
                </span>
                <span className="text-[10px] font-bold text-purple-500 uppercase tracking-[0.2em] mt-1">
                  Matrix POS
                </span>
              </div>
            </Link>

            {/* Navigation Actions */}
            <div className="flex items-center gap-8">
              <Link
                to="/login"
                className="hidden sm:flex text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-purple-600 transition-colors flex items-center gap-2"
              >
                <LogIn size={15} />
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-slate-900 hover:bg-purple-600 text-white font-bold text-[11px] px-8 py-3 rounded-2xl transition-all shadow-xl shadow-slate-200 hover:shadow-purple-200 active:scale-95 flex items-center gap-2 uppercase tracking-[0.15em]"
              >
                <UserPlus size={15} />
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* --- 🟢 HERO SECTION --- */}
        <main className="max-w-5xl mx-auto px-6 pt-48 pb-24 w-full flex-grow text-center flex flex-col items-center animate-in fade-in duration-1000">
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1] mb-10">
            Brew with <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-400 bg-clip-text text-transparent">
              confidence.
            </span>
          </h1>

          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-14 font-medium">
             Everything you need to manage orders, inventory, staff, and daily operations 
             with modern simplicity and precision.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-purple-600 hover:bg-slate-900 text-white font-bold px-12 py-5 rounded-2xl shadow-2xl shadow-purple-200 hover:shadow-slate-300 transition-all duration-500 text-[11px] uppercase tracking-[0.2em] active:scale-95 flex items-center justify-center gap-3 group"
            >
              <span>Explore Dashboard</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>

            <button
              onClick={scrollToFeatures}
              className="w-full sm:w-auto px-10 py-5 text-slate-400 hover:text-slate-900 font-bold text-[11px] uppercase tracking-[0.2em] transition-all cursor-pointer group"
            >
              Learn more{" "}
              <span className="inline-block group-hover:translate-y-1 transition-transform duration-300">
                ↓
              </span>
            </button>
          </div>
        </main>

        {/* --- 🟢 FOOTER --- */}
        <footer className="w-full py-12 px-6 border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <Coffee size={18} className="text-purple-600" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                © {new Date().getFullYear()} Bloom Café Matrix • Matrix Inc.
              </span>
            </div>
            <div className="flex items-center gap-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <button className="hover:text-purple-600 transition-colors">
                Privacy
              </button>
              <button className="hover:text-purple-600 transition-colors">
                Terms
              </button>
              <button className="hover:text-purple-600 transition-colors">
                Support
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
