// authpage.tsx

'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from "next/image";
import { ai, logo } from '@/public';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

const apiUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL; // Make sure this is correctly set in your .env.local file

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [authError, setAuthError] = useState<string | null>(null); // State for authentication errors
  const router = useRouter();

  // Background particle animation (remains the same)
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; color: string; speed: number }[]>([]);

  useEffect(() => {
    // Generate random particles for the background (remains the same)
    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      color: ['#6366F1', '#8B5CF6', '#EC4899', '#3B82F6'][Math.floor(Math.random() * 4)],
      speed: Math.random() * 0.5 + 0.2
    }));
    setParticles(newParticles);

    // Animate particles (remains the same)
    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(particle => ({
          ...particle,
          y: (particle.y + particle.speed) % 100
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      // Validate token with backend
      fetch(`${apiUrl}/api/authenticate/validate_token_user`, { // Updated endpoint: /api/authenticate/validate_token_user
        headers: {
          "Authorization": token
        }
      })
        .then(response => {
          if (response.ok) {
            setIsAuthenticated(true);
            console.log("Token validated with backend. User authenticated.");
            router.push('/dashboard'); // Redirect to dashboard after successful validation
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            console.log("Token validation failed. User not authenticated.");
            // Optionally redirect to auth page if not already there: router.push('/auth');
          }
        })
        .catch(error => {
          console.error("Token validation error:", error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null); // Clear any previous error messages

    // Simulate API call (you can remove this in production)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const authEndpoint = isLogin ? `${apiUrl}/api/authenticate/login` : `${apiUrl}/api/authenticate/signup`; // Updated endpoints
    const requestBody = isLogin ? { email, password } : { name, email, password };

    fetch(authEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Authentication failed! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data.status === "success") {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setIsAuthenticated(true);
          console.log("Authentication successful, token stored.");
          router.push('/dashboard'); // Redirect to dashboard after successful auth
        } else {
          console.error("Authentication failed:", data.message);
          setAuthError(data.message || "Authentication failed."); // Display backend message or default
        }
      })
      .catch(error => {
        console.error("Authentication Error:", error);
        setAuthError("Failed to connect to authentication server."); // Generic error for connection issues
      })
      .finally(() => setIsLoading(false));
  };

  const handleLogout = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log("No token found to logout.");
      return;
    }

    fetch(`${apiUrl}/api/authenticate/logout`, { // Updated endpoint: /api/authenticate/logout
      method: "POST",
      headers: {
        "Authorization": token
      },
    })
      .then(response => {
        if (!response.ok) {
          console.error("Logout failed:", response.statusText);
        }
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        console.log("Logout successful.");
        router.push('/auth'); // Redirect to auth page after logout
      })
      .catch(error => {
        console.error("Logout error:", error);
        alert("Logout failed. Please try again."); // User feedback on logout failure
      });
  };


  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setAuthError(null); // Clear error message when toggling auth mode
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-black to-cyan-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating particles background (remains the same) */}
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute rounded-full opacity-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color
          }}
        />
      ))}

      {/* Glowing orb (remains the same) */}
      <div className="absolute w-64 h-64 rounded-full bg-cyan-900  filter blur-3xl opacity-20 animate-pulse" />

      <Image src={logo} alt="hoobank" width={60} height={60} className="right-[0%] relative bottom-72" loading="eager" />
      <div className='text-white right-[0%] relative bottom-72 font-bold text-3xl'>MockMate</div>
      <div className='text-white  right-[14%] relative bottom-56 font-semibold text-lg whitespace-nowrap'>Utilize the power of AI for your next venture</div>
      <Image src={ai} alt="AI Avatar" width={560} className="top-12 right-72   relative" loading="eager" />

      {/* Glass card (remains the same) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full right-16 max-w-md backdrop-blur-lg bg-black/10 p-8 rounded-2xl shadow-2xl border border-white/40 z-10"
      >
        {/* Logo placeholder (remains the same) */}
        <div className="flex justify-center mb-6">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="w-20 h-20 rounded-xl bg-gradient-to-r from-black  via-cyan-900 to-black flex items-center justify-center shadow-lg"
          >
            {/* MockMate logo (remains the same) */}
            <Image src={logo} alt="hoobank" width={60} height={60} loading="eager" />
          </motion.div>
        </div>

        {/* Title (remains the same) */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-center text-white mb-6"
        >
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </motion.h2>

        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 text-red-500 text-center"
          >
            {authError}
          </motion.div>
        )}

        {/* Form (remains the same) */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name field (sign up only) (remains the same) */}
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <label className="block text-white text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Your full name"
                  required={!isLogin}
                />
              </motion.div>
            )}

            {/* Email field (remains the same) */}
            <div>
              <label className="block text-white text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password field (remains the same) */}
            <div>
              <label className="block text-white text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Action button (remains the same) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan  via-black   to-cyan-900 text-white font-medium rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition border border-cyan-900 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </motion.button>

            {/* OAuth options (remains the same) */}
            <div className="relative flex items-center justify-center mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative px-4 bg-transparent">
                <span className="text-sm text-white/60">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {/* Google (remains the same) */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                type="button"
                className="flex items-center justify-center py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
              >
                <span className="sr-only">Google</span>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  {/* Replace with actual Google icon */}
                  <span className="text-xs font-bold text-gray-800">G</span>
                </div>
              </motion.button>

              {/* GitHub (remains the same) */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                type="button"
                className="flex items-center justify-center py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
              >
                <span className="sr-only">GitHub</span>
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  {/* Replace with actual GitHub icon */}
                  <span className="text-xs font-bold text-white">f</span>
                </div>
              </motion.button>

              {/* Twitter/X (remains the same) */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                type="button"
                className="flex items-center justify-center py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
              >
                <span className="sr-only">Twitter/X</span>
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  {/* Replace with actual Twitter/X icon */}
                  <span className="text-xs font-bold text-white">X</span>
                </div>
              </motion.button>
            </div>
          </div>
        </form>

        {/* Toggle between login and signup (remains the same) */}
        <div className="text-center mt-6">
          <button
            onClick={toggleAuthMode}
            className="text-white/80 hover:text-white text-sm underline-offset-2 hover:underline transition"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>

        {/* Decorative elements (remains the same) */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </motion.div>
    </div>
  );
};

export default Auth;