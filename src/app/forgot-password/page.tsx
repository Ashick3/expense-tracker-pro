"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would call a server action to send a reset email
      // For now, we simulate success
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
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
          <h1>Reset Password</h1>
          <p>We'll send you a link to reset your password</p>
        </div>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="success-view">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={48} color="var(--success)" />
            </div>
            <h2>Check your email</h2>
            <p>We have sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.</p>
            <Link href="/login" className="auth-btn secondary">
              <ArrowLeft size={18} />
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
              {!loading && <ArrowRight size={18} />}
            </button>

            <Link href="/login" className="back-link">
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </form>
        )}
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
          line-height: 1.5;
        }

        .success-view {
          text-align: center;
        }

        .success-icon-wrapper {
          width: 80px;
          height: 80px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        h2 {
          color: var(--text-title);
          margin-bottom: 12px;
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
          text-decoration: none;
        }

        .auth-btn.secondary {
          background: rgba(124, 58, 237, 0.1);
          color: var(--primary);
          margin-top: 32px;
        }

        .auth-btn:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
        }

        .auth-btn.secondary:hover {
          background: rgba(124, 58, 237, 0.2);
        }

        .back-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--muted);
          text-decoration: none;
          margin-top: 10px;
          transition: color 0.2s ease;
        }

        .back-link:hover {
          color: var(--text-main);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
