import React from 'react';
import { RESTAURANT_INFO } from '../data/menuData.ts';

export const FoodBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#381D1A]/50 shadow-2xl mb-5 sm:mb-6 group bg-black">
      {/* High-Resolution Appetizing Food Photo Only */}
      <div className="relative aspect-[16/7] sm:aspect-[21/9] md:aspect-[3/1] w-full max-h-[300px] overflow-hidden">
        <img
          src={RESTAURANT_INFO.heroImage}
          alt="Las Flamas - Carnes a la Brasa"
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80";
          }}
        />
        {/* Subtle bottom vignette to blend naturally */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/50 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
