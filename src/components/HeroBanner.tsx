import React from 'react';
import { Flame, Sparkles, Plus, Award, Users, ArrowRight } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData.ts';
import { Product } from '../types.ts';

interface HeroBannerProps {
  featuredProduct: Product;
  onOrderNow: (product: Product) => void;
  onExploreMenu: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredProduct,
  onOrderNow,
  onExploreMenu,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1C1210] via-[#1A1A1A] to-[#121212] border border-[#381D1A]/60 shadow-2xl mb-6 sm:mb-8 group">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-bl from-[#E53935]/20 via-[#FF9800]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-60 h-60 bg-[#D32F2F]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center p-4 sm:p-6 lg:p-8 relative z-10">
        {/* Left Column: Copy & CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-4">
          {/* Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#E53935]/25 to-[#FF9800]/25 border border-[#E53935]/40 text-[#FFC107] text-xs font-bold tracking-wide uppercase">
              <Flame className="w-3.5 h-3.5 text-[#E53935] fill-[#E53935]" />
              Promo Exclusiva · Ahorra 25%
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-stone-300 font-medium bg-[#242424] px-2.5 py-1 rounded-full border border-stone-700">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              Rinde 4 - 5 personas
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] font-['Outfit'] text-balance">
            ¡El Verdadero Sabor a la Brasa en Tu Mesa!
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl">
            Disfruta nuestro <strong className="text-white font-semibold">{featuredProduct.name}</strong>: parrilla mixta jugosa a la leña, costillas BBQ ahumadas, 8 alitas fuego, papas rústicas XL y gaseosa 2L bien fría.
          </p>

          {/* Price & Actions */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#FFC107] tabular-nums font-['Outfit']">
                {RESTAURANT_INFO.currency} {featuredProduct.price.toFixed(2)}
              </span>
              {featuredProduct.originalPrice && (
                <span className="text-sm sm:text-base line-through text-stone-400 tabular-nums font-medium">
                  {RESTAURANT_INFO.currency} {featuredProduct.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => onOrderNow(featuredProduct)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#E53935] to-[#D32F2F] hover:from-[#FF6859] hover:to-[#E53935] text-white font-bold text-sm shadow-xl shadow-[#E53935]/30 active:scale-95 transition-all cursor-pointer border border-[#FF6859]/30"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Pedir Ahora</span>
              </button>

              <button
                onClick={onExploreMenu}
                className="px-4 py-3 rounded-xl bg-[#242424] hover:bg-[#2C2C2C] text-stone-200 hover:text-white font-medium text-xs sm:text-sm border border-stone-700 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Ver Menú</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Asset */}
        <div className="lg:col-span-5 relative mt-2 lg:mt-0">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] border border-amber-900/40 shadow-2xl bg-black">
            <img
              src={featuredProduct.image}
              alt="Combo Flamas Familiar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={(e) => {
                // Fallback styled visual
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80";
              }}
            />
            {/* Gradient Scrim for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Floating culinary stamp badge */}
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-[#FF9800]/50 rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-lg">
              <Award className="w-3.5 h-3.5 text-[#FFC107]" />
              <span className="text-[11px] font-bold text-white tracking-wide uppercase">
                100% Carbón de Quebracho
              </span>
            </div>

            <div className="absolute bottom-3 right-3 bg-[#E53935]/90 backdrop-blur-md border border-white/20 rounded-lg px-2.5 py-1 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-[#FFC107]" />
              Especialidad de la Casa
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
