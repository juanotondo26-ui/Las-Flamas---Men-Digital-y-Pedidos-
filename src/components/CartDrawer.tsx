import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingCart, ArrowRight, Tag, Check, Sparkles, AlertCircle } from 'lucide-react';
import { CartItem, DeliveryType } from '../types.ts';
import { RESTAURANT_INFO } from '../data/menuData.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  deliveryType: DeliveryType;
  onSetDeliveryType: (type: DeliveryType) => void;
  onProceedToCheckout: () => void;
  promoCode: string;
  onApplyPromoCode: (code: string) => boolean;
  discountAmount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  deliveryType,
  onSetDeliveryType,
  onProceedToCheckout,
  promoCode,
  onApplyPromoCode,
  discountAmount,
}) => {
  if (!isOpen) return null;

  const [inputCoupon, setInputCoupon] = useState(promoCode);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(Boolean(promoCode));

  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryFee = deliveryType === 'delivery' ? (subtotal >= RESTAURANT_INFO.freeDeliveryThreshold ? 0 : RESTAURANT_INFO.deliveryCost) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const ok = onApplyPromoCode(inputCoupon.trim().toUpperCase());
    if (ok) {
      setCouponSuccess(true);
      setCouponError('');
    } else {
      setCouponError('Cupón no válido. Prueba con "FLAMAS10"');
      setCouponSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#161616] border-l border-[#292929] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-[#242424] flex items-center justify-between bg-[#1A1A1A]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E53935] to-[#B71C1C] flex items-center justify-center text-white shadow-md">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-['Outfit']">
                  Tu Pedido
                </h2>
                <p className="text-xs text-stone-400">
                  {items.length} {items.length === 1 ? 'producto añadido' : 'productos añadidos'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-stone-400 hover:text-red-400 p-2 transition-colors cursor-pointer"
                  title="Vaciar todo el pedido"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-[#242424] hover:bg-[#2E2E2E] text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Cerrar carrito"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Delivery Mode Toggle */}
          <div className="p-3 bg-[#1A1A1A]/80 border-b border-[#242424]">
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#121212] rounded-xl border border-[#262626]">
              <button
                type="button"
                onClick={() => onSetDeliveryType('delivery')}
                className={`py-1.5 text-center text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  deliveryType === 'delivery'
                    ? 'bg-[#E53935] text-white font-bold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                🛵 Delivery
              </button>
              <button
                type="button"
                onClick={() => onSetDeliveryType('takeaway')}
                className={`py-1.5 text-center text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  deliveryType === 'takeaway'
                    ? 'bg-[#E53935] text-white font-bold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                🏬 Retiro
              </button>
              <button
                type="button"
                onClick={() => onSetDeliveryType('dinein')}
                className={`py-1.5 text-center text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  deliveryType === 'dinein'
                    ? 'bg-[#E53935] text-white font-bold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                🍽️ En Mesa
              </button>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-[#222222]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[#202020] border border-[#2E2E2E] flex items-center justify-center text-stone-500">
                  <ShoppingCart className="w-8 h-8 text-stone-600" />
                </div>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs text-stone-400 max-w-xs">
                  Añade carnes a la brasa, hamburguesas jugosas o alitas crujientes para comenzar tu pedido.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Explorar la Carta
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.cartItemId} className="pt-3.5 first:pt-0 flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-[#2A2A2A]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-snug truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="text-stone-500 hover:text-red-400 p-0.5"
                        title="Eliminar producto"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Custom options chips */}
                    <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-stone-400">
                      {item.selectedCookingPoint && (
                        <span className="bg-[#222222] px-1.5 py-0.5 rounded text-amber-400/90 border border-amber-900/30">
                          {item.selectedCookingPoint.split('(')[0].trim()}
                        </span>
                      )}
                      {item.selectedSpicyLevel !== undefined && (
                        <span className="bg-[#222222] px-1.5 py-0.5 rounded text-red-400 border border-red-900/30">
                          🌶️ {item.selectedSpicyLevel === 0 ? 'Sin picante' : `Picante ${item.selectedSpicyLevel}`}
                        </span>
                      )}
                      {item.selectedSauce && (
                        <span className="bg-[#222222] px-1.5 py-0.5 rounded text-stone-300">
                          {item.selectedSauce}
                        </span>
                      )}
                      {item.selectedSide && (
                        <span className="bg-[#222222] px-1.5 py-0.5 rounded text-stone-300">
                          {item.selectedSide}
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-[10px] text-stone-400 italic mt-0.5 line-clamp-1">
                        "{item.notes}"
                      </p>
                    )}

                    {/* Price and Counter */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs sm:text-sm font-extrabold text-[#FFC107] tabular-nums font-['Outfit']">
                        {RESTAURANT_INFO.currency} {item.itemTotal.toFixed(2)}
                      </div>

                      <div className="flex items-center bg-[#202020] border border-[#2D2D2D] rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-300 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-300 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with calculation & Proceed button */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#141414] border-t border-[#242424] space-y-3.5">
              {/* Promo Coupon Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => {
                      setInputCoupon(e.target.value);
                      setCouponError('');
                    }}
                    placeholder="Código promo (ej: FLAMAS10)"
                    className="w-full bg-[#1F1F1F] text-xs text-white placeholder-stone-400 pl-8 pr-3 py-2 rounded-xl border border-[#2C2C2C] focus:outline-none focus:border-[#E53935] uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#252525] hover:bg-[#303030] text-xs font-bold text-stone-200 hover:text-white rounded-xl border border-[#333333] transition-colors"
                >
                  Aplicar
                </button>
              </form>

              {couponSuccess && (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <Check className="w-3 h-3" />
                  Cupón aplicado: 10% de descuento en tu orden.
                </div>
              )}
              {couponError && (
                <div className="text-[11px] text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {couponError}
                </div>
              )}

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-stone-300 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-white">
                    {RESTAURANT_INFO.currency} {subtotal.toFixed(2)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento Promo</span>
                    <span className="tabular-nums font-medium">
                      -{RESTAURANT_INFO.currency} {discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {deliveryType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Envío a domicilio</span>
                    <span className="tabular-nums font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-400 font-bold">¡GRATIS!</span>
                      ) : (
                        `${RESTAURANT_INFO.currency} ${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-[#262626]">
                  <span className="font-['Outfit']">Total a Pagar</span>
                  <span className="text-[#FFC107] font-['Outfit'] tabular-nums text-lg">
                    {RESTAURANT_INFO.currency} {finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Delivery notice */}
              {deliveryType === 'delivery' && subtotal < RESTAURANT_INFO.freeDeliveryThreshold && (
                <div className="text-[11px] text-stone-400 bg-[#1E1E1E] p-2 rounded-lg border border-[#2A2A2A] text-center">
                  Agrega{' '}
                  <span className="text-[#FFC107] font-bold">
                    {RESTAURANT_INFO.currency}{' '}
                    {(RESTAURANT_INFO.freeDeliveryThreshold - subtotal).toFixed(2)}
                  </span>{' '}
                  más para obtener <strong className="text-emerald-400">Envío Gratis</strong>.
                </div>
              )}

              {/* Primary Checkout CTA */}
              <button
                onClick={onProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#E53935] hover:from-[#E53935] hover:to-[#FF6859] text-white font-bold text-sm shadow-xl shadow-[#E53935]/25 active:scale-95 transition-all cursor-pointer border border-[#FF6859]/30"
              >
                <span>Continuar con WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
