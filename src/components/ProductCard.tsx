import React, { useState } from 'react';
import { Plus, Flame, Star, Heart, Check, Users } from 'lucide-react';
import { Product } from '../types.ts';
import { RESTAURANT_INFO } from '../data/menuData.ts';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onOpenDetail: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetail,
  isFavorite,
  onToggleFavorite,
}) => {
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, e);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <div
      onClick={() => onOpenDetail(product)}
      className="group relative flex flex-col justify-between bg-[#1A1A1A] hover:bg-[#202020] rounded-2xl overflow-hidden border border-[#2A2A2A] hover:border-[#E53935]/40 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#E53935]/10 cursor-pointer"
    >
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#141414]">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#261514] to-[#141414] text-center">
            <Flame className="w-8 h-8 text-[#E53935] mb-2 animate-pulse" />
            <span className="text-xs font-semibold text-stone-300 line-clamp-2">
              {product.name}
            </span>
            <span className="text-[10px] text-amber-500 mt-1">Especialidad a la Brasa</span>
          </div>
        )}

        {/* Ambient Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/30 pointer-events-none" />


        {/* Favorite Heart Button top-right */}
        <button
          onClick={(e) => onToggleFavorite(product.id, e)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-sm flex items-center justify-center text-stone-300 hover:text-white transition-all border border-white/10 z-10"
          aria-label="Guardar favorito"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isFavorite ? 'fill-[#E53935] text-[#E53935]' : 'text-stone-300'
            }`}
          />
        </button>

        {/* Spicy indicator tag if applicable */}
        {product.hasSpicyOption && (
          <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-amber-400 font-semibold flex items-center gap-1 border border-amber-900/40">
            <span>🌶️</span>
            <span>Nivel Picante</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Metadata Row: Portions or Rating */}
          <div className="flex items-center justify-between text-xs text-stone-300 mb-1.5">
            <span className="text-[#FF9800] font-semibold truncate tracking-wide">
              {product.subcategory}
            </span>
            {product.rating && (
              <span className="flex items-center gap-1 text-stone-200 font-semibold">
                <Star className="w-3.5 h-3.5 text-[#FFC107] fill-[#FFC107]" />
                <span className="tabular-nums">{product.rating}</span>
              </span>
            )}
          </div>

          {/* Dish Name */}
          <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-snug line-clamp-2 group-hover:text-[#FFC107] transition-colors font-['Outfit']">
            {product.name}
          </h3>

          {/* Short Ingredients / Sides Description */}
          <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed mt-1 font-normal">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Row */}
        <div className="pt-2.5 border-t border-[#262626] flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-[#FFC107] tabular-nums font-['Outfit']">
                {RESTAURANT_INFO.currency} {product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs line-through text-stone-400 tabular-nums">
                  {RESTAURANT_INFO.currency} {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.portions && (
              <span className="text-xs text-stone-400 flex items-center gap-1 font-medium">
                <Users className="w-3 h-3 text-stone-400" />
                {product.portions}
              </span>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleAdd}
            className={`flex items-center justify-center gap-1 h-9 px-3 sm:px-3.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-[#D32F2F] to-[#E53935] hover:from-[#E53935] hover:to-[#FF6859] text-white shadow-[#E53935]/20 border border-[#FF6859]/30'
            }`}
            title="Añadir a la orden"
            aria-label={`Añadir ${product.name} al carrito`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden xs:inline">¡Listo!</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden xs:inline">Añadir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
