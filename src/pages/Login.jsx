import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

export default function LoginPage({ setCurrentPage }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setCurrentPage('home');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-safra-offwhite flex items-center justify-center px-4 pt-20 pb-16">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 text-safra-gray hover:text-safra-terracotta transition-colors mb-8 font-body text-sm"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-safra-terracotta to-safra-terracottalight rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-serif font-bold text-2xl">S</span>
            </div>
            <h1 className="font-serif font-bold text-2xl text-safra-navy mb-2">
              Welcome Back
            </h1>
            <p className="text-safra-gray text-sm font-body">
              Sign in to your Safra account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-safra-corallight rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-safra-coral shrink-0 mt-0.5" />
              <p className="text-sm text-safra-coral font-body font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-safra-navy mb-1.5 font-body">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-safra-graylight" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-safra-navy font-body
                             focus:border-safra-terracotta focus:ring-2 focus:ring-safra-terracotta/10 outline-none transition-all
                             placeholder:text-safra-graylight"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-safra-navy mb-1.5 font-body">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-safra-graylight" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-safra-navy font-body
                             focus:border-safra-terracotta focus:ring-2 focus:ring-safra-terracotta/10 outline-none transition-all
                             placeholder:text-safra-graylight"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none py-3.5"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-safra-gray text-sm font-body">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-safra-terracotta font-bold hover:text-safra-terracottalight transition-colors"
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
