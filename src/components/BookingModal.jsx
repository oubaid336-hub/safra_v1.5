import React, { useState, useEffect } from 'react';
import { MapPin, X, Check } from 'lucide-react';

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

export default function BookingModal({ item, itemType, onClose }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(0);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setDays(diffDays);
        setTotalPrice(diffDays * item.price);
        setDateError('');
      } else {
        setDays(0);
        setTotalPrice(0);
        setDateError('Check-out must be after check-in');
      }
    } else {
      setDateError('');
    }
  }, [checkIn, checkOut, item.price]);

  const handleConfirm = () => {
    if (days > 0) setConfirmed(true);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
        <div className="relative h-48 overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-safra-navy hover:bg-safra-terracotta hover:text-white transition-all shadow-lg"
          >
            <X size={18} strokeWidth={2} />
          </button>
          <div className="absolute bottom-4 left-5 text-white">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-safra-terracotta mb-1 inline-block">
              {itemType === 'house' ? 'Stay' : 'Car'}
            </span>
            <h3 className="font-serif font-bold text-xl">{item.name}</h3>
            <p className="text-white/80 text-sm flex items-center gap-1">
              <MapPin size={14} /> {item.location || item.type}
            </p>
          </div>
        </div>

        <div className="p-6">
          {!confirmed ? (
            <>
              <h4 className="font-serif font-bold text-safra-navy text-lg mb-4 flex items-center gap-2">
                <CalendarIcon /> Book Your {itemType === 'house' ? 'Stay' : 'Ride'}
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-safra-navy mb-1.5">
                    {itemType === 'house' ? 'Check-in' : 'Pick-up'}
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-safra-navy font-body
                               focus:border-safra-terracotta focus:ring-2 focus:ring-safra-terracotta/10 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-safra-navy mb-1.5">
                    {itemType === 'house' ? 'Check-out' : 'Return'}
                  </label>
                  <input
                    type="date"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-safra-navy font-body
                               focus:border-safra-terracotta focus:ring-2 focus:ring-safra-terracotta/10 outline-none transition-all"
                  />
                </div>
              </div>

              {dateError && (
                <p className="mt-3 text-sm text-safra-terracotta font-body font-semibold">
                  {dateError}
                </p>
              )}

              {days > 0 && (
                <div className="mt-5 p-5 bg-safra-sandlight rounded-xl">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-safra-navy font-body font-semibold">{item.price} TND x {days} {itemType === 'house' ? 'nights' : 'days'}</span>
                    <span className="font-serif font-bold text-safra-navy">{totalPrice} TND</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-safra-sand">
                    <span className="font-serif font-bold text-safra-navy">Total</span>
                    <span className="font-serif font-bold text-2xl text-safra-terracotta">{totalPrice} TND</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleConfirm}
                disabled={days <= 0}
                className="w-full mt-5 btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                Confirm Booking
              </button>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-safra-sandlight rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-safra-sand">
                <Check size={36} className="text-safra-terracotta" strokeWidth={3} />
              </div>
              <h3 className="font-serif font-bold text-2xl text-safra-navy mb-2">Booking Confirmed!</h3>
              <p className="text-safra-gray font-body mb-6">
                Your {itemType === 'house' ? 'stay' : 'rental'} at <strong>{item.name}</strong> is booked for <strong>{days}</strong> {itemType === 'house' ? 'nights' : 'days'}.
              </p>
              <div className="bg-safra-sandlight rounded-xl p-4 mb-6">
                <p className="font-serif font-bold text-xl text-safra-navy">{totalPrice} TND</p>
                <p className="text-safra-gray text-xs font-bold uppercase tracking-wider mt-1">Total Paid</p>
              </div>
              <button onClick={onClose} className="btn-secondary">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
