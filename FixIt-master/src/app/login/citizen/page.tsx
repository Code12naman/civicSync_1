"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShieldCheck, MapPin, Clock3 } from 'lucide-react';
import Link from "next/link";
import { addUser, userExists, findUser } from "@/lib/mock-users";

// Use signIn for login
const signIn = async (email: string, pass: string) => {
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay
  const user = findUser(email, pass, "citizen");
  if (user) {
    return { user: { uid: user.email, email: user.email } };
  } else {
    throw new Error("Invalid credentials. Please check your email and password or sign up.");
  }
};

export default function CitizenLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [existingSessionEmail, setExistingSessionEmail] = useState<string | null>(null);

  // Detect existing session; show options instead of auto-redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existingEmail = window.localStorage.getItem('citizenUserEmail');
      setExistingSessionEmail(existingEmail);
    }
    // Ensure inputs start empty to show generic placeholders
    setEmail('');
    setPassword('');
    setSignupEmail('');
    setSignupPassword('');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      if (typeof window !== 'undefined') {
        localStorage.setItem('citizenUserEmail', email);
      }
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push('/citizen/dashboard');
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      toast({
        title: "Login Failed",
        description: err.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccess(null);
    setSignupLoading(true);
    try {
      if (!signupName || !signupEmail || !signupPassword) {
        setSignupError("Please enter name, email, and password.");
        return;
      }
      if (userExists(signupEmail)) {
        setSignupError("User already exists. Please login.");
        return;
      }
      addUser(signupEmail, signupPassword, "citizen", signupName.trim());
      if (typeof window !== 'undefined') {
        localStorage.setItem('citizenUserEmail', signupEmail);
      }
      setSignupSuccess("Account created! You can now log in.");
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
    } catch (err: any) {
      setSignupError("Failed to create account.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5faf6]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl px-4 md:px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.42 }}
          className="relative overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Civic information panel */}
            <div className="bg-gradient-to-br from-[#e8f6ed] via-[#f4fbf6] to-[#e0f4e8] text-slate-900 p-8 md:p-10 flex flex-col gap-6 justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-70" aria-hidden>
                <svg viewBox="0 0 400 260" className="w-full h-full">
                  <rect x="12" y="160" width="60" height="60" rx="10" fill="#bfead5" />
                  <rect x="90" y="120" width="55" height="100" rx="10" fill="#6ee7b7" />
                  <rect x="160" y="95" width="55" height="125" rx="10" fill="#22c55e" />
                  <rect x="230" y="135" width="55" height="85" rx="10" fill="#86efac" />
                  <rect x="300" y="110" width="55" height="110" rx="10" fill="#34d399" />
                  <circle cx="200" cy="75" r="12" fill="#f6c146" />
                  <path d="M40 190 L360 190" stroke="#d9e8dd" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="120" cy="190" r="8" fill="#d9e8dd" />
                  <circle cx="210" cy="190" r="8" fill="#d9e8dd" />
                  <circle cx="300" cy="190" r="8" fill="#d9e8dd" />
                </svg>
              </div>

              <div className="relative z-10">
                <Link href="/" className="text-sm font-semibold text-emerald-800">CivicSync</Link>
                <motion.h2
                  initial={{ x: -8, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.06 }}
                  className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900"
                >
                  Citizen Access Portal
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.14 }}
                  className="mt-3 text-sm leading-relaxed text-slate-700 max-w-md"
                >
                  Report local issues, track resolution progress, and collaborate with authorities to build safer, smarter cities.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  className="mt-5 space-y-3 text-sm"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <span>Report civic issues in seconds</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <span>AI-verified complaints for faster action</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock3 className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <span>Real-time tracking & transparency</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="relative bg-white">
              <div className="px-6 py-8 md:py-10 md:px-10">
                <div className="mb-6">
                  <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="text-2xl font-semibold text-slate-900">{mode === 'login' ? 'Citizen Login' : 'Create Citizen Account'}</motion.h2>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="text-sm text-slate-600">{mode === 'login' ? 'Sign in to continue to your FixIt dashboard.' : 'Create your account to start reporting and tracking civic issues.'}</motion.p>
                </div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="space-y-4">
                  {mode === 'login' && error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {mode === 'signup' && (signupError || signupSuccess) && (
                    <Alert variant={signupError ? 'destructive' : 'default'}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{signupError ? 'Signup Failed' : 'Account Created'}</AlertTitle>
                      <AlertDescription>{signupError || signupSuccess}</AlertDescription>
                    </Alert>
                  )}

                  {mode === 'login' ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          autoComplete="off"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                          className="shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg pr-10"
                          />
                          <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" aria-hidden />
                        </div>
                        <p className="text-xs text-slate-500">Your data is secure and used only for civic issue resolution.</p>
                      </div>

                      <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full py-3 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" disabled={loading}>
                        {loading ? 'Logging in...' : 'Sign In to CivicSync'}
                      </motion.button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signupName" className="block text-sm font-medium text-slate-700">Full Name</Label>
                        <Input
                          id="signupName"
                          type="text"
                          placeholder="Your name"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          disabled={signupLoading}
                          className="shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signupEmail" className="block text-sm font-medium text-slate-700">Email</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="Enter your email address"
                          autoComplete="off"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          disabled={signupLoading}
                          className="shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signupPassword" className="block text-sm font-medium text-slate-700">Password</Label>
                        <div className="relative">
                          <Input
                            id="signupPassword"
                            type="password"
                            placeholder="Create a secure password"
                            autoComplete="new-password"
                            required
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            disabled={signupLoading}
                            className="shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg pr-10"
                          />
                          <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" aria-hidden />
                        </div>
                        <p className="text-xs text-slate-500">Use a secure password; your data stays within FixIt for civic resolution only.</p>
                      </div>

                      <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full py-3 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" disabled={signupLoading}>
                        {signupLoading ? 'Creating account...' : 'Create Account'}
                      </motion.button>
                    </form>
                  )}

                  <div className="flex items-center justify-between text-sm text-emerald-700 mt-2">
                    <Link href="#" className="hover:underline">Reset Password</Link>
                    <button onClick={() => setMode(mode==='login' ? 'signup' : 'login')} className="hover:underline">{mode==='login' ? 'New Citizen? Create Account' : 'Back to Login'}</button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
