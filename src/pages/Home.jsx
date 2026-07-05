import React from 'react';
import { HomeIcon, Car, MapPin, ChevronRight } from 'lucide-react';

export default function HomePage({ setCurrentPage }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section — Full-bleed image with centered text overlay */}
      <div className="relative h-screen min-h-[600px] flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1600&auto=format&fit=crop&q=80" 
          alt="Tunisia" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="font-serif font-bold text-5xl md:text-7xl text-white mb-6 tracking-wide">
            WELCOME TO TUNISIA
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-body">
            From the white-washed streets of Sidi Bou Said to the golden sands of the Sahara, find your perfect stay and explore with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button 
              onClick={() => setCurrentPage('houses')} 
              className="bg-white text-safra-navy font-semibold px-8 py-4 rounded-xl hover:bg-white/90 transition-all duration-300 shadow-lg"
            >
              Find a Stay
            </button>
            <button 
              onClick={() => setCurrentPage('cars')} 
              className="bg-safra-terracotta text-white font-semibold px-8 py-4 rounded-xl hover:bg-safra-terracottalight transition-all duration-300 shadow-lg"
            >
              Rent a Car
            </button>
          </div>
        </div>
      </div>

      {/* Why Choose Safra Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Why Choose Safra?</h2>
            <p className="text-safra-gray max-w-xl mx-auto font-body">
              Experience Tunisia like a local with our curated selection of homes and vehicles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[ 
              { 
                icon: HomeIcon, 
                title: "Curated Stays", 
                desc: "Handpicked homes in the most beautiful Tunisian locations" 
              },
              { 
                icon: Car, 
                title: "Reliable Cars", 
                desc: "Well-maintained vehicles for exploring every corner of Tunisia" 
              },
              { 
                icon: MapPin, 
                title: "Local Expertise", 
                desc: "We know Tunisia inside out and share the best hidden gems" 
              },
            ].map((feature, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-safra-sandlight rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-safra-sand transition-colors duration-300">
                  <feature.icon size={28} className="text-safra-terracotta" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif font-bold text-xl text-safra-navy mb-3">{feature.title}</h3>
                <p className="text-safra-gray font-body leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations Section */}
      <div className="py-20 bg-safra-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">Popular Destinations</h2>
            <p className="text-safra-gray max-w-xl mx-auto font-body">
              Explore the most loved places across Tunisia.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
              { name: "Tunis", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&auto=format&fit=crop" },
              { name: "Hammamet", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format&fit=crop" },
              { name: "Sousse", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&auto=format&fit=crop" },
              { name: "Djerba", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop" },
              { name: "Sidi Bou Said", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&auto=format&fit=crop" },
            ].map((dest, i) => (
              <div 
                key={i} 
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => setCurrentPage('houses')}
              >
                <img 
                  src={dest.img} 
                  alt={dest.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-serif font-bold text-white text-lg">{dest.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="py-20 bg-safra-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-safra-terracotta/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-safra-blue/20 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-4">
            Ready for Your Tunisia Adventure?
          </h2>
          <p className="text-white/70 font-body mb-8 text-lg max-w-xl mx-auto">
            Whether it's a beach villa or a desert retreat — we've got you covered!
          </p>
          <button 
            onClick={() => setCurrentPage('houses')} 
            className="bg-white text-safra-navy font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center gap-2"
          >
            Start Exploring <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
