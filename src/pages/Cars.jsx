import React from 'react';
import { Users } from 'lucide-react';
import { cars, tagColors } from '../data';

export default function CarsPage({ setBookingItem }) {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-safra-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-safra-sandlight text-safra-terracotta px-4 py-1.5 rounded-full font-serif font-bold text-xs tracking-wider uppercase mb-4">
            Fleet
          </span>
          <h1 className="section-title text-3xl md:text-4xl mb-3">Rent Your Ride</h1>
          <p className="text-safra-gray max-w-lg mx-auto font-body">
            Explore Tunisia at your own pace with our quality fleet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="card group">
              <div className="relative h-52 overflow-hidden bg-safra-offwhite">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${tagColors[car.tag] || 'bg-safra-yellow text-safra-navy'}`}>
                    {car.tag}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-safra-navy/80 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                  {car.type}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif font-bold text-lg text-safra-navy mb-2">{car.name}</h3>
                <div className="flex items-center gap-3 text-xs text-safra-gray mb-4 font-body">
                  <span className="flex items-center gap-1"><Users size={13} /> {car.seats} seats</span>
                  <span>{car.transmission}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {car.features.map((feature, i) => (
                    <span key={i} className="bg-safra-offwhite text-safra-navy px-2.5 py-1 rounded-lg text-[10px] font-bold">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="font-serif font-bold text-2xl text-safra-terracotta">{car.price}</span>
                    <span className="text-safra-gray text-xs font-body ml-1">TND/day</span>
                  </div>
                  <button 
                    onClick={() => setBookingItem({ ...car, type: 'car' })}
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
