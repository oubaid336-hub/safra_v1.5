import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowLeft, AlertCircle, MapPin, Home } from 'lucide-react';

export default function SignupPage({ setCurrentPage }) {
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('traveler');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await signup(email, password, fullName, role);
    setLoading(false);

    if (result.success) {
      setCurrentPage('home');
    } else {
      setError(result.error || 'Signup failed. Please try again.');
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
              Create Account
            </h1>
            <p className="text-safra-gray text-sm font-body">
              Join Safra and start your Tunisia adventure
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
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-safra-graylight" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-safra-navy font-body
                             focus:border-safra-terracotta focus:ring-2 focus:ring-safra-terracotta/10 outline-none transition-all
                             placeholder:text-safra-graylight"
                  required
                />
              </div>
            </div>

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
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-safra-navy font-body
                             focus:border-safra-terracotta focus:ring-2 focus:ring-safra-terracotta/10 outline-none transition-all
                             placeholder:text-safra-graylight"
                  required
                />
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-bold text-safra-navy mb-3 font-body">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('traveler')}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left group ${
                    role === 'traveler'
                      ? 'border-safra-terracotta bg-safra-sandlight'
                      : 'border-gray-200 hover:border-safra-sanddark bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-colors ${
                    role === 'traveler' ? 'bg-safra-terracotta' : 'bg-safra-sandlight group-hover:bg-safra-sand'
                  }`}>
                    <MapPin size={18} className={role === 'traveler' ? 'text-white' : 'text-safra-terracotta'} />
                  </div>
                  <p className={`font-serif font-bold text-sm ${role === 'traveler' ? 'text-safra-terracotta' : 'text-safra-navy'}`}>
                    Traveler
                  </p>
                  <p className="text-xs text-safra-gray mt-0.5 font-body">
                    Explore Tunisia
                  </p>
                  {role === 'traveler' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-safra-terracotta rounded-full flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setRole('host')}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left group ${
                    role === 'host'
                      ? 'border-safra-terracotta bg-safra-sandlight'
                      : 'border-gray-200 hover:border-safra-sanddark bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-colors ${
                    role === 'host' ? 'bg-safra-terracotta' : 'bg-safra-sandlight group-hover:bg-safra-sand'
                  }`}>
                    <Home size={18} className={role === 'host' ? 'text-white' : 'text-safra-terracotta'} />
                  </div>
                  <p className={`font-serif font-bold text-sm ${role === 'host' ? 'text-safra-terracotta' : 'text-safra-navy'}`}>
                    Host
                  </p>
                  <p className="text-xs text-safra-gray mt-0.5 font-body">
                    List your property
                  </p>
                  {role === 'host' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-safra-terracotta rounded-full flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none py-3.5"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-safra-gray text-sm font-body">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-safra-terracotta font-bold hover:text-safra-terracottalight transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
