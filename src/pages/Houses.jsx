import React from 'react';
import { MapPin, Star, Users } from 'lucide-react';
import { houses, tagColors } from '../data';

export default function HousesPage({ setBookingItem }) {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-safra-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-safra-sandlight text-safra-terracotta px-4 py-1.5 rounded-full font-serif font-bold text-xs tracking-wider uppercase mb-4">
            Accommodations
          </span>
          <h1 className="section-title text-3xl md:text-4xl mb-3">Find Your Perfect Stay</h1>
          <p className="text-safra-gray max-w-lg mx-auto font-body">
            Beautiful homes across Tunisia's most stunning locations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {houses.map((house) => (
            <div key={house.id} className="card group">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={house.image} 
                  alt={house.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${tagColors[house.tag] || 'bg-safra-turquoise text-white'}`}>
                    {house.tag}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star size={14} className="text-safra-yellow fill-safra-yellow" />
                  <span className="font-bold text-xs text-safra-navy">{house.rating}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-safra-terracotta text-xs font-bold uppercase tracking-wider mb-2">
                  <MapPin size={14} />
                  <span>{house.location}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-safra-navy mb-2">{house.name}</h3>
                <p className="text-safra-gray text-sm font-body mb-4 line-clamp-2">{house.description}</p>
                <div className="flex items-center gap-3 text-xs text-safra-gray mb-4 font-body">
                  <span className="flex items-center gap-1"><Users size={13} /> {house.guests} guests</span>
                  <span>{house.reviews} reviews</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="font-serif font-bold text-2xl text-safra-terracotta">{house.price}</span>
                    <span className="text-safra-gray text-xs font-body ml-1">TND/night</span>
                  </div>
                  <button 
                    onClick={() => setBookingItem({ ...house, type: 'house' })}
                    className="btn-primary text-sm py-2.5 px-5"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
