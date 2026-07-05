import React, { useState, useEffect } from 'react';
import { Home, Car, HomeIcon, LogOut, User, Shield, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentPage, setCurrentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, userRole, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setCurrentPage('home');
    }
  };

  // Get initials from full name
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get first name
  const getFirstName = (name) => {
    if (!name) return 'User';
    return name.split(' ')[0];
  };

  const isAuthPage = currentPage === 'login' || currentPage === 'signup';
  const isDashboardPage = currentPage === 'host-dashboard' || currentPage === 'admin';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || isAuthPage || isDashboardPage ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 group">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            scrolled || isAuthPage || isDashboardPage ? 'bg-safra-terracotta' : 'bg-white/20 backdrop-blur-sm'
          }`}>
            <span className="font-serif font-bold text-lg text-white">S</span>
          </div>
          <span className={`font-serif text-2xl font-bold transition-colors duration-300 ${
            scrolled || isAuthPage || isDashboardPage ? 'text-safra-navy' : 'text-white'
          }`}>
            Safra
          </span>
        </button>

        <div className="flex items-center gap-1">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'houses', label: 'Houses', icon: HomeIcon },
            { id: 'cars', label: 'Cars', icon: Car },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-serif font-bold text-sm transition-all duration-300 ${
                currentPage === item.id
                  ? 'bg-safra-terracotta text-white shadow-md'
                  : scrolled || isAuthPage || isDashboardPage
                    ? 'text-safra-gray hover:bg-safra-sandlight hover:text-safra-terracotta'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={16} strokeWidth={2} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}

          {/* Host Dashboard nav item */}
          {currentUser && userRole === 'host' && (
            <button
              onClick={() => setCurrentPage('host-dashboard')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-serif font-bold text-sm transition-all duration-300 ${
                currentPage === 'host-dashboard'
                  ? 'bg-safra-terracotta text-white shadow-md'
                  : scrolled || isAuthPage || isDashboardPage
                    ? 'text-safra-gray hover:bg-safra-sandlight hover:text-safra-terracotta'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <LayoutDashboard size={16} strokeWidth={2} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          )}

          {/* Admin nav item */}
          {currentUser && userRole === 'admin' && (
            <button
              onClick={() => setCurrentPage('admin')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-serif font-bold text-sm transition-all duration-300 ${
                currentPage === 'admin'
                  ? 'bg-safra-terracotta text-white shadow-md'
                  : scrolled || isAuthPage || isDashboardPage
                    ? 'text-safra-gray hover:bg-safra-sandlight hover:text-safra-terracotta'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Shield size={16} strokeWidth={2} />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}
        </div>

        {/* Right side: Auth buttons or User info */}
        <div className="flex items-center gap-2">
          {!currentUser ? (
            <>
              <button
                onClick={() => setCurrentPage('login')}
                className={`px-4 py-2 rounded-full font-serif font-bold text-sm transition-all duration-300 ${
                  scrolled || isAuthPage || isDashboardPage
                    ? 'text-safra-navy hover:bg-safra-sandlight'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setCurrentPage('signup')}
                className="px-4 py-2 rounded-full font-serif font-bold text-sm bg-safra-terracotta text-white hover:bg-safra-terracottalight transition-all duration-300 shadow-md"
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-safra-terracotta rounded-full flex items-center justify-center">
                  <span className="text-white font-serif font-bold text-xs">
                    {getInitials(currentUser.full_name || currentUser.email)}
                  </span>
                </div>
                <span className={`hidden md:inline font-serif font-bold text-sm ${
                  scrolled || isAuthPage || isDashboardPage ? 'text-safra-navy' : 'text-white'
                }`}>
                  {getFirstName(currentUser.full_name || currentUser.email)}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 rounded-full transition-all duration-300 ${
                  scrolled || isAuthPage || isDashboardPage
                    ? 'text-safra-gray hover:bg-safra-sandlight hover:text-safra-terracotta'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                title="Logout"
              >
                <LogOut size={18} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
