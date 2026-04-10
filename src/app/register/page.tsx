"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrendingUp, User, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { registerUser } from "@/lib/actions";
import { useToast } from "@/context/ToastContext";

export default function Register() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setSuccess(true);
      showToast("Registration successful! Redirecting to login...", "success");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      const msg = err.message || "Something went wrong during registration";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="logo-icon-large">
            <TrendingUp size={32} color="var(--primary)" />
          </div>
          <h1>Join ExpensePro</h1>
          <p>Start your journey to financial freedom</p>
        </div>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert success">
            <CheckCircle2 size={18} />
            <span>Registration successful! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                placeholder="John Doe" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                placeholder="name@example.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link href="/login">Log in</Link></p>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: radial-gradient(circle at top right, rgba(124, 58, 237, 0.1), transparent),
                      radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.1), transparent);
        }

        .auth-card {
          width: 100%;
          max-width: 450px;
          padding: 40px;
          animation: slideUp 0.5s ease;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-icon-large {
          width: 64px;
          height: 64px;
          background: rgba(124, 58, 237, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        h1 {
          font-size: 1.75rem;
          color: var(--text-title);
          margin-bottom: 8px;
        }

        p {
          color: var(--muted);
          font-size: 0.95rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          color: var(--muted);
        }

        input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text-main);
          outline: none;
          transition: all 0.2s ease;
        }

        input:focus {
          border-color: var(--primary);
          background: rgba(124, 58, 237, 0.05);
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
        }

        .auth-btn {
          margin-top: 10px;
          padding: 14px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .auth-btn:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
        }

        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-alert {
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
        }

        .auth-alert.error {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .auth-alert.success {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .auth-footer {
          margin-top: 32px;
          text-align: center;
          font-size: 0.9rem;
          color: var(--muted);
        }

        .auth-footer a {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
