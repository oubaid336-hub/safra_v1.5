import React from 'react';
import { Sparkles, Sun } from 'lucide-react';

export default function Footer({ setCurrentPage }) {
  return (
    <footer className="bg-safra-navy text-white py-14 mt-0 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-safra-terracotta via-safra-yellow to-safra-blue" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-safra-terracotta to-safra-terracottalight rounded-xl flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">S</span>
              </div>
              <span className="font-serif text-2xl font-bold">Safra</span>
            </div>
            <p className="text-safra-graylight text-sm leading-relaxed">
              Discover Tunisia's beauty with curated stays and reliable car rentals. Your journey starts here.
            </p>
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-safra-yellow" /> Quick Links
            </h3>
            <div className="space-y-2 text-safra-graylight text-sm">
              <p 
                className="hover:text-white transition-colors cursor-pointer"
                onClick={() => setCurrentPage && setCurrentPage('houses')}
              >Houses</p>
              <p 
                className="hover:text-white transition-colors cursor-pointer"
                onClick={() => setCurrentPage && setCurrentPage('cars')}
              >Cars</p>
              <p 
                className="hover:text-white transition-colors cursor-pointer"
                onClick={() => setCurrentPage && setCurrentPage('home')}
              >Home</p>
              <p 
                className="hover:text-white transition-colors cursor-pointer"
                onClick={() => setCurrentPage && setCurrentPage('home')}
              >About Us</p>
            </div>
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
              <Sun size={18} className="text-safra-yellow" /> Contact
            </h3>
            <div className="space-y-2 text-safra-graylight text-sm">
              <p>safra.tn</p>
              <p>Tunisia</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-8 text-center text-safra-graylight/50 text-xs font-serif">
          &copy; 2026 Safra. Discover Tunisia, Your Way.
        </div>
      </div>
    </footer>
  );
}
