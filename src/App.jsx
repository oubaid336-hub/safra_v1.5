import React, { useState, useEffect } from 'react';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import HomePage from './pages/Home';
import HousesPage from './pages/Houses';
import CarsPage from './pages/Cars';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import HostDashboard from './pages/HostDashboard';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [bookingItem, setBookingItem] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleBook = (item) => {
    if (!currentUser) {
      setCurrentPage('login');
      return;
    }
    setBookingItem(item);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage setCurrentPage={setCurrentPage} />;
      case 'houses': return <HousesPage setBookingItem={handleBook} />;
      case 'cars': return <CarsPage setBookingItem={handleBook} />;
      case 'login': return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'signup': return <SignupPage setCurrentPage={setCurrentPage} />;
      case 'host-dashboard': return <HostDashboard setCurrentPage={setCurrentPage} />;
      case 'admin': return <AdminDashboard setCurrentPage={setCurrentPage} />;
      default: return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
      <Footer setCurrentPage={setCurrentPage} />

      {bookingItem && (
        <BookingModal 
          item={bookingItem} 
          itemType={bookingItem.type} 
          onClose={() => setBookingItem(null)} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
