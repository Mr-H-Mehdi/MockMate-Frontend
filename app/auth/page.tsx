'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from "next/image";
import { ai, logo } from '@/public';
import { useRouter } from 'next/navigation';
import 'animate.css'; // Using the animate.css library

const apiUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
const mlApiUrl = process.env.NEXT_PUBLIC_ML_API_BASE_URL;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  // Background particle animation
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; color: string; speed: number }[]>([]);

  useEffect(() => {
    // Generate random particles for the background
    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      color: ['#6366F1', '#8B5CF6', '#EC4899', '#3B82F6'][Math.floor(Math.random() * 4)],
      speed: Math.random() * 0.5 + 0.2
    }));
    setParticles(newParticles);

    // Animate particles
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
      fetch(`${apiUrl}/api/authenticate/validate_token_user`, {
        headers: {
          "Authorization": token
        }
      })
        .then(response => {
          if (response.ok) {
            setIsAuthenticated(true);
            console.log("Token validated with backend. User authenticated.");
            router.replace('/dashboard');
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            console.log("Token validation failed. User not authenticated.");
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

  useEffect(() => {
    const wakeupServers = () => {
      // Make both requests simultaneously without waiting for each other
      const wakeBackend = fetch(`${apiUrl}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(response => {
          console.log("Backend API status:", response.status);
          return response;
        })
        .catch(error => {
          console.log("Error waking backend:", error);
          // Retry after a short delay if the request fails
          setTimeout(() => wakeBackend, 300);
        });

      const wakeML = fetch(`${mlApiUrl}/`, {
        method: "GET",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(response => {
          console.log("ML API status:", response.status);
          return response;
        })
        .catch(error => {
          console.log("Error waking ML service:", error);
          // Retry after a short delay if the request fails
          setTimeout(() => wakeML, 300);
        });

      // You can use Promise.all to wait for both if needed
      Promise.all([wakeBackend, wakeML])
        .then(() => console.log("Both services are awake"))
        .catch(error => console.log("Error waking services:", error));
    };

    // Initial wake-up call
    wakeupServers();

    // Optional: Set up a periodic ping to keep the services awake
    // This will ping both servers every 14 minutes to prevent them from going idle
    const keepAliveInterval = setInterval(wakeupServers, 14 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(keepAliveInterval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const authEndpoint = isLogin ? `${apiUrl}/api/authenticate/login` : `${apiUrl}/api/authenticate/signup`;
    const requestBody = isLogin ? { email, password } : { name, email, password };

    fetch(authEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then(response => {
        console.log(response);

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
          router.push('/dashboard');
        } else {
          console.error("Authentication failed:", data.message);
          setAuthError(data.message || "Authentication failed.");
        }
      })
      .catch(error => {
        console.error("Authentication Error:", error);
        setAuthError("Failed to connect to authentication server.");
      })
      .finally(() => setIsLoading(false));
  };

  const handleLogout = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log("No token found to logout.");
      router.replace("/ ")
      return;
    }

    fetch(`${apiUrl}/api/authenticate/logout`, {
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
        router.push('/auth');
      })
      .catch(error => {
        console.error("Logout error:", error);
        alert("Logout failed. Please try again.");
      });
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setAuthError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-black to-cyan-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating particles background */}
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

      {/* Glowing orb */}
      <div className="absolute w-64 h-64 rounded-full bg-cyan-900 filter blur-3xl opacity-20 animate-pulse" />

      {/* Left-aligned logo and text */}
      <div className="absolute top-6 left-6 md:top-12 md:left-12 flex items-center z-20 animate__animated animate__fadeInLeft">
        <Image src={logo} alt="MockMate" width={50} height={50} className="mr-4" loading="eager" />
        <div>
          <h1 className="text-white font-bold text-2xl md:text-3xl">MockMate</h1>
          <p className="text-white font-medium text-sm md:text-base">Utilize the power of AI for your next venture</p>
        </div>
      </div>

      {/* AI Image, positioned large and in the same place */}
      <div className="absolute top-1/4 right-2/4  transform -translate-y-1/4 z-10 animate__animated animate__fadeInLeft animate__delay-1s">
        <Image
          src={ai}
          alt="AI Avatar"
          width={600}
          height={600}
          className="max-w-none md:max-w-3xl"
          loading="eager"
        />
      </div>

      {/* Auth form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md backdrop-blur-lg bg-black/10 p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/40 z-20 ml-auto mr-12 lg:mr-24 animate__animated animate__zoomIn"
      >
        {/* Title with animation */}
        <h2 className="text-2xl font-bold text-center text-white mb-6 animate__animated animate__fadeIn animate__delay-0.5s">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {authError && (
          <div className="mb-4 text-red-500 text-center animate__animated animate__shakeX">
            {authError}
          </div>
        )}

        {/* Form with animated elements */}
        <form onSubmit={handleSubmit} className="animate__animated animate__fadeIn animate__delay-0.5s">
          <div className="space-y-4">
            {/* Name field (sign up only) */}
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

            {/* Email field */}
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

            {/* Password field */}
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

            {/* Action button with animation */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-700 via-black to-cyan-900 text-white font-medium rounded-lg shadow-lg focus:outline-none transition border border-cyan-900 mt-6 hover:scale-105 animate__animated animate__pulse animate__infinite animate__slower"
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
            </button>

            {/* OAuth options */}
            <div className="relative flex items-center justify-center mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative px-4 bg-transparent">
                <span className="text-sm text-white/60">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {/* OAuth buttons with animations */}
              <button
                type="button"
                className="flex items-center justify-center py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition animate__animated animate__fadeInUp animate__delay-0.5s"
              >
                <span className="sr-only">Google</span>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">G</span>
                </div>
              </button>

              <button
                type="button"
                className="flex items-center justify-center py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition animate__animated animate__fadeInUp animate__delay-1s"
              >
                <span className="sr-only">GitHub</span>
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">f</span>
                </div>
              </button>

              <button
                type="button"
                className="flex items-center justify-center py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition animate__animated animate__fadeInUp animate__delay-2s"
              >
                <span className="sr-only">Twitter/X</span>
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">X</span>
                </div>
              </button>
            </div>
          </div>
        </form>

        {/* Toggle between login and signup with animation */}
        <div className="text-center mt-6 animate__animated animate__fadeIn animate__delay-1s">
          <button
            onClick={toggleAuthMode}
            className="text-white/80 hover:text-white text-sm underline-offset-2 hover:underline transition"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Mobile responsiveness adjustments */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .max-w-none {
            max-width: 80vw;
            position: absolute;
            right: -10vw;
            opacity: 0.7;
            z-index: 5;
          }
        }
      `}</style>
    </div>
  );
};

export default Auth;