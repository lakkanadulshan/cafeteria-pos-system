import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast"; // Toast එකතු කළා
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  
  const hasCalledApi = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing from the link.");
      toast.error("Invalid link");
      return;
    }

    if (hasCalledApi.current) return;
    hasCalledApi.current = true;

    const verifyToken = async () => {
      try {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message || "Email verified successfully!");
        toast.success("Account activated successfully!");
      } catch (err) {
        setStatus("error");
        const errorMsg = err.response?.data?.message || "Invalid or expired verification link.";
        setMessage(errorMsg);
        toast.error("Activation failed");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans text-slate-900 relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] bg-indigo-50/30 rounded-full blur-[100px] pointer-events-none -z-0" />

      <div className="max-w-[420px] w-full bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl shadow-purple-500/5 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Verification Logic View */}
        {status === "verifying" && (
          <div className="flex flex-col items-center py-10 space-y-6 text-center">
            <div className="relative">
              <Loader2 size={64} className="animate-spin text-purple-600" />
              <div className="absolute inset-0 blur-2xl bg-purple-600/20 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Verifying</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Validating your identity </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center py-6 space-y-8 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] text-emerald-500 border border-emerald-100 flex items-center justify-center shadow-inner">
              <CheckCircle2 size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Activated</h2>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                {message}
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-slate-900 hover:bg-purple-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-purple-200 transition-all duration-300 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95"
            >
              <span>Initialize Session</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center py-6 space-y-8 text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-[2rem] text-rose-500 border border-rose-100 flex items-center justify-center shadow-inner">
              <XCircle size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Failed</h2>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                {message}
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-slate-900 hover:bg-purple-600 text-white font-black py-5 rounded-2xl transition-all text-[11px] uppercase tracking-[0.2em] active:scale-95 shadow-xl shadow-slate-200"
            >
              Return to Login
            </button>
          </div>
        )}

        {/* Footer Brand Label */}
        <div className="mt-10 pt-8 border-t border-slate-50 flex justify-center">
           <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">Bloom Café Matrix Terminal</span>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;