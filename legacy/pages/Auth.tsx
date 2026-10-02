import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from '../lib/googleAuth';
import supabase from '../lib/supabase';
import { SectionHeader } from '../components/LumaMark';
import { Mail, Lock, LogIn, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/console';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !fullName)) {
      setError("Please fill out all fields.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        if (signUpError) throw signUpError;
        alert("Account created successfully! Please log in.");
        setIsSignUp(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grad-hero min-h-screen pt-28 pb-24 flex items-center">
      <div className="container-x max-w-md space-y-8">
        <div className="text-center space-y-2">
          <span className="eyebrow">
            <span className="eyebrow-dot bg-orange-500" />
            LUNA Access
          </span>
          <h2 className="font-display text-2xl font-extrabold text-ink-900 tracking-tight">
            {isSignUp ? "Create your workspace" : "Sign in to LUNA Console"}
          </h2>
          <p className="text-xs text-ink-500">
            {isSignUp ? "Register your branch or organization" : "Access your queue board and intelligence dashboard"}
          </p>
        </div>

        <div className="card p-6 sm:p-8 bg-white">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={16} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Oluwaseun Taiwo"
                    className="input !pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. seun@luna-service.com"
                  className="input !pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input !pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-pink-50 border border-pink-200 text-pink-600 rounded-xl flex items-center gap-2 text-xs font-semibold">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Please wait...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? "Create account" : "Sign in to console"}</span>
                  <LogIn size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ink-100" />
            </div>
            <span className="relative bg-white px-3 text-xs font-semibold text-ink-300">or</span>
          </div>

          {/* Google Sign-in */}
          <button
            onClick={() => signInWithGoogle('LUNA Console')}
            className="btn btn-outline btn-lg w-full flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.94 1 12 1 7.35 1 3.32 3.68 1.32 7.6l3.8 2.95C6.12 7.37 8.84 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.44c-.28 1.48-1.07 2.74-2.31 3.58l3.6 2.79c2.1-1.94 3.76-4.79 3.76-8.61z"
              />
              <path
                fill="#FBBC05"
                d="M5.12 14.51c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27L1.32 7.02C.48 8.71 0 10.3 0 12s.48 3.29 1.32 4.98l3.8-2.95z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.6-2.79c-1.1.74-2.51 1.18-4.36 1.18-3.16 0-5.88-2.33-6.88-5.51L1.32 15.92C3.32 19.84 7.35 23 12 23z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Toggle link */}
          <div className="mt-6 text-center text-xs font-semibold text-ink-500">
            {isSignUp ? (
              <p>
                Already have an account?{" "}
                <button onClick={() => setIsSignUp(false)} className="text-orange-500 hover:underline">
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Don't have a console workspace?{" "}
                <button onClick={() => setIsSignUp(true)} className="text-orange-500 hover:underline">
                  Register branch
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
