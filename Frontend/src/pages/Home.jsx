import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";

import heroImg from "../assets/home1.jpg"; 

import {
  LogIn,
  UserPlus,
  ArrowRight,
  Coffee,
  Sparkles,
  Zap,
  ChevronRight,
  ShieldCheck,
  Receipt
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-slate-900 selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden">
      
      {/* Subtle Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-50/60 rounded-full blur-[130px] pointer-events-none -z-0" />
      <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-[120px] pointer-events-none -z-0" />

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
                className="hidden sm:flex text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-purple-600 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LogIn size={15} />
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-slate-900 hover:bg-purple-600 text-white font-bold text-[11px] px-8 py-3.5 rounded-2xl transition-all shadow-xl shadow-slate-200 hover:shadow-purple-200 active:scale-95 flex items-center gap-2 uppercase tracking-[0.15em] cursor-pointer"
              >
                <UserPlus size={15} />
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* --- 🟢 HERO SECTION --- */}
        <main className="max-w-7xl mx-auto px-6 pt-32 lg:pt-44 pb-20 w-full flex-grow flex items-center">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
            
            {/* LEFT SIDE: CONTENT */}
            <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-[10px] font-black tracking-[0.2em] uppercase">
                <Zap size={14} className="animate-pulse text-purple-600" /> Smart POS Terminal v2.0
              </div> */}

              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[1]">
                Brew with <br />
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-400 bg-clip-text text-transparent">
                  confidence.
                </span>
              </h1>

              <p className="text-slate-500 text-base sm:text-lg max-w-lg leading-relaxed font-medium">
                Simplify every order, every day.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
                <Link
                  to="/login"
                  className="w-full sm:w-auto bg-purple-600 hover:bg-slate-900 text-white font-bold px-10 py-4.5 rounded-2xl shadow-2xl shadow-purple-200 hover:shadow-slate-300 transition-all duration-500 text-[11px] uppercase tracking-[0.2em] active:scale-95 flex items-center justify-center gap-3 group cursor-pointer"
                >
                  <span>Explore Dashboard</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>

                {/* <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4.5 text-slate-500 hover:text-slate-900 font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Learn more</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link> */}
              </div>

            </div>

            {/* RIGHT SIDE: CUSTOM IMAGE CONTAINER */}
            <div className="lg:col-span-5 relative flex justify-center items-center animate-in fade-in slide-in-from-right-8 duration-1000">
              
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-indigo-500/10 rounded-[3rem] rotate-3 scale-95 blur-2xl -z-10" />

              {/* Main Image Frame */}
              <div className="relative w-full max-w-md bg-slate-50/50 backdrop-blur-md rounded-[2.5rem] border-4 border-white shadow-2xl shadow-purple-900/10 p-6 flex items-center justify-center group overflow-hidden">
                
                <img 
                  src={heroImg} 
                  alt="Bloom Cafe POS System" 
                  className="w-full h-auto max-h-[480px] object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle Floating Feature Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-purple-600/30">
                      <Coffee size={18} />
                    </div> */}
                    {/* <div>
                      <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Bloom POS Active</h4>
                      <p className="text-[9px] font-bold text-purple-600 uppercase tracking-widest mt-0.5">Terminal Ready</p>
                    </div> */}
                  </div>
                  {/* <span className="text-[10px] font-black text-slate-800 px-2.5 py-1 bg-slate-100 rounded-lg">
                    v2.0
                  </span> */}
                </div>

              </div>

            </div>

          </div>
        </main>

        {/* --- 🟢 FOOTER --- */}
        <footer className="w-full py-8 px-6 border-t border-slate-100 bg-white mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Coffee size={18} className="text-purple-600" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                © {new Date().getFullYear()} Bloom Café Matrix • Matrix Inc.
              </span>
            </div>
            <div className="flex items-center gap-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <button className="hover:text-purple-600 transition-colors cursor-pointer">
                Privacy
              </button>
              <button className="hover:text-purple-600 transition-colors cursor-pointer">
                Terms
              </button>
              <button className="hover:text-purple-600 transition-colors cursor-pointer">
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