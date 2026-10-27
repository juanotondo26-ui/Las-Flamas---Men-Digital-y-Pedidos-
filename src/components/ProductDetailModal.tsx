import React, { useState } from 'react';
import { X, Flame, Plus, Minus, Check, Star, Users, MessageSquare } from 'lucide-react';
import { Product } from '../types.ts';
import { RESTAURANT_INFO, SAUCE_OPTIONS, SIDE_OPTIONS, COOKING_POINTS } from '../data/menuData.ts';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (customizedItem: {
    product: Product;
    quantity: number;
    selectedSpicyLevel?: number;
    selectedSauce?: string;
    selectedSide?: string;
    selectedCookingPoint?: string;
    notes?: string;
    itemTotal: number;
  }) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSpicyLevel, setSelectedSpicyLevel] = useState<number>(
    product.defaultSpicyLevel ?? (product.hasSpicyOption ? 1 : 0)
  );
  const [selectedSauce, setSelectedSauce] = useState<string>(
    product.sauceOptions?.[0] || SAUCE_OPTIONS[0]
  );
  const [selectedSide, setSelectedSide] = useState<string>(
    product.sideOptions?.[0] || SIDE_OPTIONS[0]
  );
  const [selectedCookingPoint, setSelectedCookingPoint] = useState<string>(
    product.cookingPointOptions?.[1] || COOKING_POINTS[1]
  );
  const [notes, setNotes] = useState('');

  const unitPrice = product.price;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    onAddToCart({
      product,
      quantity,
      selectedSpicyLevel: product.hasSpicyOption ? selectedSpicyLevel : undefined,
      selectedSauce: product.sauceOptions || product.categoryId.includes('familiar') || product.categoryId.includes('alitas') || product.categoryId.includes('hamburguesas') ? selectedSauce : undefined,
      selectedSide: product.sideOptions ? selectedSide : undefined,
      selectedCookingPoint: product.cookingPointOptions ? selectedCookingPoint : undefined,
      notes: notes.trim() ? notes.trim() : undefined,
      itemTotal: totalPrice,
    });
    onClose();
  };

  const spicyLevels = [
    { level: 0, label: 'Sin Picante', icon: '🍃' },
    { level: 1, label: 'Suave', icon: '🌶️' },
    { level: 2, label: 'Medio', icon: '🔥' },
    { level: 3, label: 'Fuego Extremo', icon: '🔥🔥' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#181818] rounded-t-3xl sm:rounded-3xl border border-[#2E2E2E] max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative aspect-[16/9] w-full bg-black shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/60 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer z-10"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 bg-[#E53935] text-white px-2.5 py-1 rounded-md text-xs font-bold uppercase shadow-md flex items-center gap-1 border border-white/10">
              <Flame className="w-3 h-3 fill-white" />
              <span>{product.badge}</span>
            </div>
          )}

          {/* Price Tag overlay */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                {product.subcategory}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] leading-tight">
                {product.name}
              </h2>
            </div>
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-black text-[#FFC107] font-['Outfit'] tabular-nums">
                {RESTAURANT_INFO.currency} {product.price.toFixed(2)}
              </div>
              {product.originalPrice && (
                <div className="text-xs text-stone-400 line-through tabular-nums">
                  {RESTAURANT_INFO.currency} {product.originalPrice.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Customization Options */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 divide-y divide-[#262626]">
          {/* Description & Info */}
          <div className="space-y-2">
            <p className="text-sm text-stone-300 leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
              {product.portions && (
                <span className="flex items-center gap-1 text-stone-300">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  {product.portions}
                </span>
              )}
              {product.rating && (
                <span className="flex items-center gap-1 text-stone-300">
                  <Star className="w-3.5 h-3.5 text-[#FFC107] fill-[#FFC107]" />
                  <span>{product.rating} ({product.reviewCount} reseñas)</span>
                </span>
              )}
            </div>
          </div>

          {/* Cooking point if meat */}
          {product.cookingPointOptions && (
            <div className="pt-4 space-y-2">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Término de la Carne
              </label>
              <div className="grid grid-cols-1 gap-2">
                {product.cookingPointOptions.map((cp) => (
                  <button
                    key={cp}
                    type="button"
                    onClick={() => setSelectedCookingPoint(cp)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                      selectedCookingPoint === cp
                        ? 'bg-[#E53935]/20 border-[#E53935] text-white font-semibold'
                        : 'bg-[#202020] border-[#2E2E2E] text-stone-300 hover:bg-[#252525]'
                    }`}
                  >
                    <span>{cp}</span>
                    {selectedCookingPoint === cp && (
                      <Check className="w-4 h-4 text-[#FFC107]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spicy Level Selector if applicable */}
          {(product.hasSpicyOption || product.defaultSpicyLevel !== undefined) && (
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#E53935]" />
                  Nivel de Picante
                </label>
                <span className="text-[11px] text-stone-400">Elige la intensidad</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {spicyLevels.map((sp) => {
                  const isSelected = selectedSpicyLevel === sp.level;
                  return (
                    <button
                      key={sp.level}
                      type="button"
                      onClick={() => setSelectedSpicyLevel(sp.level)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-[#E53935]/25 border-[#E53935] text-white shadow-sm'
                          : 'bg-[#202020] border-[#2C2C2C] text-stone-400 hover:text-white hover:bg-[#252525]'
                      }`}
                    >
                      <span className="text-base mb-0.5">{sp.icon}</span>
                      <span className="text-[11px] font-semibold">{sp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sauce Selector */}
          {(product.sauceOptions || SAUCE_OPTIONS) && (
            <div className="pt-4 space-y-2">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Salsa Principal de Acompañamiento
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(product.sauceOptions || SAUCE_OPTIONS).map((sauce) => (
                  <button
                    key={sauce}
                    type="button"
                    onClick={() => setSelectedSauce(sauce)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      selectedSauce === sauce
                        ? 'bg-[#FF9800]/20 border-[#FF9800] text-white font-semibold'
                        : 'bg-[#202020] border-[#2C2C2C] text-stone-300 hover:bg-[#252525]'
                    }`}
                  >
                    <span>{sauce}</span>
                    {selectedSauce === sauce && (
                      <Check className="w-3.5 h-3.5 text-[#FFC107]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Side Options */}
          {product.sideOptions && (
            <div className="pt-4 space-y-2">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Guarnición
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.sideOptions.map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setSelectedSide(side)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      selectedSide === side
                        ? 'bg-[#E53935]/20 border-[#E53935] text-white font-semibold'
                        : 'bg-[#202020] border-[#2C2C2C] text-stone-300 hover:bg-[#252525]'
                    }`}
                  >
                    <span>{side}</span>
                    {selectedSide === side && (
                      <Check className="w-3.5 h-3.5 text-[#FFC107]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes textarea */}
          <div className="pt-4 space-y-2">
            <label className="block text-xs font-bold text-stone-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
              Instrucciones Especiales para Cocina (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Sin cebolla, salsas bien separadas, punto crocante..."
              className="w-full bg-[#202020] border border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#E53935]"
            />
          </div>
        </div>

        {/* Footer with Quantity Counter & Add CTA */}
        <div className="p-4 bg-[#141414] border-t border-[#262626] flex items-center justify-between gap-3 shrink-0">
          {/* Quantity Selector */}
          <div className="flex items-center bg-[#202020] border border-[#2E2E2E] rounded-xl p-1 shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-white tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Add CTA */}
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#E53935] hover:from-[#E53935] hover:to-[#FF6859] text-white font-bold text-sm shadow-lg shadow-[#E53935]/25 active:scale-95 transition-all cursor-pointer border border-[#FF6859]/30"
          >
            <span>Agregar al Pedido</span>
            <span>·</span>
            <span className="text-[#FFC107] tabular-nums">
              {RESTAURANT_INFO.currency} {totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
