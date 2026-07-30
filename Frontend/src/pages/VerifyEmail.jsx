import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios"; // BaseURL: http://localhost:3000/api
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
      return;
    }

    if (hasCalledApi.current) return;
    hasCalledApi.current = true;

    const verifyToken = async () => {
      try {
        // http://localhost:3000/api/auth/verify-email?token=... වලට Call වේ.
        const response = await api.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message || "Email verified successfully!");
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Invalid or expired verification link."
        );
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
        
        {status === "verifying" && (
          <div className="flex flex-col items-center py-6 space-y-4">
            <Loader2 size={48} className="animate-spin text-purple-600" />
            <h2 className="text-xl font-black text-slate-900">Verifying Account</h2>
            <p className="text-xs font-semibold text-slate-400">Please wait while we validate your activation token...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center py-4 space-y-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Account Activated!</h2>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full mt-4 bg-purple-600 hover:bg-slate-900 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-purple-200 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <span>Proceed to Login</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center py-4 space-y-4">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 border border-rose-100">
              <XCircle size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Verification Failed</h2>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full mt-4 bg-slate-900 hover:bg-purple-600 text-white font-black py-3.5 rounded-2xl transition-all text-xs uppercase tracking-widest"
            >
              Return to Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;