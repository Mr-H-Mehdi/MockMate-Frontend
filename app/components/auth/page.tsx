// authpage.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Reset loading state
    setIsLoading(false);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 relative overflow-hidden">
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
      <div className="absolute w-64 h-64 rounded-full bg-purple-500 filter blur-3xl opacity-20 animate-pulse" />
      
      {/* Glass card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 z-10"
      >
        {/* Logo placeholder */}
        <div className="flex justify-center mb-6">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="w-16 h-16 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
          >
            {/* Replace with your actual logo */}
            <span className="text-white text-2xl font-bold">A</span>
          </motion.div>
        </div>
        
        {/* Title */}
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-center text-white mb-6"
        >
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </motion.h2>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
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
            
            {/* Action button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition mt-6"
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
              {/* Google */}
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
              
              {/* GitHub */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                type="button"
                className="flex items-center justify-center py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
              >
                <span className="sr-only">GitHub</span>
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  {/* Replace with actual GitHub icon */}
                  <span className="text-xs font-bold text-white">G</span>
                </div>
              </motion.button>
              
              {/* Twitter/X */}
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
        
        {/* Toggle between login and signup */}
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
        
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </motion.div>
    </div>
  );
};

export default Auth;