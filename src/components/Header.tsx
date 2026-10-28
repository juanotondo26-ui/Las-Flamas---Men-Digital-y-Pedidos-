import React from 'react';
import { ShoppingCart, Search, X, Flame, Clock, Phone, MapPin } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData.ts';

interface HeaderProps {
  cartItemCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategoryName: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  cartTotal,
  onOpenCart,
  searchQuery,
  onSearchChange,
  activeCategoryName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-[#262626] transition-all">
      {/* Top micro-bar for trust & hours */}
      <div className="bg-[#1A1A1A] border-b border-[#262626] py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <span className="flex items-center gap-1.5 text-[#FFC107] font-semibold tracking-wide text-xs">
            <Flame className="w-3.5 h-3.5 text-[#E53935] fill-[#E53935]" />
            Flamas encendidas de 12:00 PM a 11:00 PM
          </span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <div className="relative group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#FFC107] shadow-lg shadow-[#E53935]/20 bg-black flex items-center justify-center">
              <img
                src={RESTAURANT_INFO.logo}
                alt={RESTAURANT_INFO.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if logo fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            {/* Ambient flame glow */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#E53935]/30 to-[#FF9800]/30 blur-sm -z-10 group-hover:opacity-100 transition-opacity opacity-75 pointer-events-none" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white font-['Outfit']">
                {RESTAURANT_INFO.name}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#E53935]/20 text-[#FF6859] font-semibold border border-[#E53935]/30 hidden xs:inline">
                Parrillas & Grill
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 font-medium">
              {RESTAURANT_INFO.slogan}
            </p>
            {/* Interactive Address & Cellphone under Slogan */}
            <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 mt-1">
              <a
                href="https://maps.google.com/?q=Av.+Las+Am%C3%A9ricas+131"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-stone-200 hover:text-[#FFC107] font-semibold transition-colors"
                title="Abrir ubicación en Google Maps"
              >
                <MapPin className="w-3.5 h-3.5 text-[#E53935] shrink-0" />
                <span className="underline decoration-stone-500 hover:decoration-[#FFC107] underline-offset-2">Av. Las Américas 131</span>
              </a>
              <span className="text-stone-500 hidden xs:inline">·</span>
              <a
                href="tel:72877666"
                className="flex items-center gap-1.5 text-xs text-[#25D366] hover:text-[#2bf578] font-bold transition-colors"
                title="Llamar o contactar al 72877666"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>72877666</span>
              </a>
            </div>
          </div>
        </div>

        {/* Search Bar - Desktop & Tablet */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar hamburguesas, alitas, costillas, combos, bebidas..."
            className="w-full bg-[#1F1F1F] text-white placeholder-stone-400 text-sm pl-10 pr-9 py-2 rounded-xl border border-[#2E2E2E] focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-0.5"
              title="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Actions: Cart Button with Shopping Cart Icon */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#E53935] hover:from-[#E53935] hover:to-[#FF6859] text-white font-semibold shadow-lg shadow-[#E53935]/25 active:scale-95 transition-all cursor-pointer border border-[#FF6859]/30"
            aria-label="Abrir carrito de compras"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FFC107] text-[#121212] font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#121212] shadow-sm tabular-nums animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] leading-tight text-white/80 uppercase font-medium">Carrito</span>
              <span className="text-xs font-bold leading-tight tabular-nums text-white">
                {cartTotal > 0 ? `${RESTAURANT_INFO.currency} ${cartTotal.toFixed(2)}` : 'Bs. 0.00'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-2.5 pt-0.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar en Las Flamas..."
            className="w-full bg-[#1F1F1F] text-white placeholder-stone-400 text-xs pl-9 pr-8 py-2 rounded-xl border border-[#2E2E2E] focus:outline-none focus:border-[#E53935] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
