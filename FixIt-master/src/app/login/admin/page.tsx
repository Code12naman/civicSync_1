"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShieldCheck } from 'lucide-react';
import Link from "next/link";
import { motion } from 'framer-motion';
import { addUser, userExists, findUser } from "@/lib/mock-users";

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [existingSessionEmail, setExistingSessionEmail] = useState<string | null>(null);

  // Detect existing session; show options instead of auto-redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existingEmail = window.localStorage.getItem('adminUserEmail');
      setExistingSessionEmail(existingEmail);
    }
    // Ensure inputs start empty to show generic placeholders
    setEmail('');
    setPassword('');
    setSignupEmail("");
    setSignupPassword("");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user = findUser(email, password, "admin");
      if (!user) {
        throw new Error("Invalid credentials or insufficient permissions.");
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('adminUserEmail', email);
        localStorage.setItem('adminUserRole', 'admin');
      }

      toast({ title: "Login Successful", description: "Redirecting to admin dashboard..." });
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
      toast({ title: "Login Failed", description: err.message, variant: "destructive" });
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
      if (!signupEmail || !signupPassword) {
        throw new Error("Please enter both email and password.");
      }
      if (userExists && userExists(signupEmail)) {
        throw new Error("User already exists. Please login instead.");
      }

      addUser(signupEmail, signupPassword, "admin");

      if (typeof window !== 'undefined') {
        localStorage.setItem('adminUserEmail', signupEmail);
        localStorage.setItem('adminUserRole', 'admin');
      }

      setSignupEmail("");
      setSignupPassword("");
      setSignupSuccess("Admin account created.");
      toast({ title: "Account Created", description: "Your admin account has been created successfully." });
    } catch (err: any) {
      setSignupError(err.message);
      toast({ title: "Signup Failed", description: err.message, variant: "destructive" });
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
            {/* Left: Ops information panel */}
            <div className="bg-gradient-to-br from-[#e3f2ff] via-[#f1f7ff] to-[#e8f6ed] text-slate-900 p-8 md:p-10 flex flex-col gap-6 justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-70" aria-hidden>
                <svg viewBox="0 0 400 260" className="w-full h-full">
                  <rect x="12" y="160" width="60" height="60" rx="10" fill="#cfe1ff" />
                  <rect x="90" y="120" width="55" height="100" rx="10" fill="#7dd3fc" />
                  <rect x="160" y="95" width="55" height="125" rx="10" fill="#38bdf8" />
                  <rect x="230" y="135" width="55" height="85" rx="10" fill="#22c55e" />
                  <rect x="300" y="110" width="55" height="110" rx="10" fill="#34d399" />
                  <circle cx="200" cy="75" r="12" fill="#f6c146" />
                  <path d="M40 190 L360 190" stroke="#d9e8dd" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="120" cy="190" r="8" fill="#d9e8dd" />
                  <circle cx="210" cy="190" r="8" fill="#d9e8dd" />
                  <circle cx="300" cy="190" r="8" fill="#d9e8dd" />
                </svg>
              </div>

              <div className="relative z-10">
                <Link href="/" className="text-sm font-semibold text-slate-800">FixIt Ops</Link>
                <motion.h2
                  initial={{ x: -8, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.06 }}
                  className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900"
                >
                  Admin Control Center
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.14 }}
                  className="mt-3 text-sm leading-relaxed text-slate-700 max-w-md"
                >
                  Manage citizen reports, oversee assignments, and keep city services moving smoothly.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  className="mt-5 space-y-3 text-sm"
                >
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <span>Secure access to admin tools and dashboards</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <span>Prioritize and assign incidents faster</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <span>Track SLAs and resolution KPIs in real time</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="relative bg-white">
              <div className="px-6 py-8 md:py-10 md:px-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="space-y-1">
                    <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="text-2xl font-semibold text-slate-900">
                      {mode === 'login' ? 'Admin Login' : 'Create Admin Account'}
                    </motion.h2>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="text-sm text-slate-600">
                      {mode === 'login' ? 'Sign in to access the admin dashboard.' : 'Provision an admin account to manage reports.'}
                    </motion.p>
                  </div>
                  <div className="text-xs text-muted-foreground bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-semibold">Demo: admin@example.com / password</div>
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          className="shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          className="shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Login as Admin'}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="signupEmail">Email</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="Enter your email address"
                          autoComplete="off"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          required
                          disabled={signupLoading}
                          className="shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="signupPassword">Password</Label>
                        <Input
                          id="signupPassword"
                          type="password"
                          placeholder="Create a secure password"
                          autoComplete="new-password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                          disabled={signupLoading}
                          className="shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
                        />
                      </div>
                      <Button type="submit" variant="outline" className="w-full" disabled={signupLoading}>
                        {signupLoading ? 'Creating...' : 'Create Admin Account'}
                      </Button>
                    </form>
                  )}

                  <div className="pt-2 text-sm text-slate-600 flex items-center justify-between">
                    <span>{mode === 'login' ? "Need an admin account?" : "Already have admin access?"}</span>
                    <button
                      type="button"
                      onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setSignupError(null); setSignupSuccess(null); }}
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      {mode === 'login' ? 'Create admin account' : 'Back to login'}
                    </button>
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

