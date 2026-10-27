import React from 'react';
import { ShoppingBag, Search, X, Flame, Clock, Phone, MapPin } from 'lucide-react';
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
      <div className="bg-[#1A1A1A] border-b border-[#262626] py-1 px-4 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#FFC107] font-semibold">
              <Flame className="w-3.5 h-3.5 text-[#E53935] fill-[#E53935]" />
              Brasas Encendidas
            </span>
            <span className="text-stone-600">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              12:00 PM - 11:30 PM
            </span>
            <span className="text-stone-600 hidden sm:inline">·</span>
            <span className="hidden sm:inline text-stone-400">
              Delivery: <span className="text-stone-200 font-medium">{RESTAURANT_INFO.deliveryTime}</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-stone-400">
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber.replace('+', '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-[#FFC107] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#25D366]" />
              <span className="hidden md:inline">WhatsApp Pedidos:</span>
              <span className="text-stone-300 font-medium">{RESTAURANT_INFO.whatsappDisplay}</span>
            </a>
          </div>
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
              <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-white font-['Outfit']">
                {RESTAURANT_INFO.name}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#E53935]/20 text-[#FF6859] font-medium border border-[#E53935]/30 hidden xs:inline">
                Parrillas & Grill
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-400 font-medium truncate max-w-[190px] sm:max-w-none">
              {RESTAURANT_INFO.slogan}
            </p>
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

        {/* Right Actions: Cart Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#E53935] hover:from-[#E53935] hover:to-[#FF6859] text-white font-semibold shadow-lg shadow-[#E53935]/25 active:scale-95 transition-all cursor-pointer border border-[#FF6859]/30"
            aria-label="Abrir carrito de compras"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-white" />
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
