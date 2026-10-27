import React from 'react';
import { CheckCircle2, Flame, Clock, MapPin, Phone, MessageSquare, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { OrderDetails, CartItem } from '../types.ts';
import { RESTAURANT_INFO } from '../data/menuData.ts';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  orderDetails: OrderDetails | null;
  items: CartItem[];
  onResetOrder: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  ticketId,
  orderDetails,
  items,
  onResetOrder,
}) => {
  if (!isOpen || !orderDetails) return null;

  const subtotal = items.reduce((sum, i) => sum + i.itemTotal, 0);
  const deliveryFee = orderDetails.deliveryType === 'delivery' ? (subtotal >= RESTAURANT_INFO.freeDeliveryThreshold ? 0 : RESTAURANT_INFO.deliveryCost) : 0;
  const grandTotal = Math.max(0, subtotal - orderDetails.discount + deliveryFee);

  const steps = [
    { title: 'Pedido Confirmado', desc: 'Comanda recibida', active: true, done: true },
    { title: 'A las Brasas', desc: 'Cocción a leña y carbón', active: true, done: false },
    { title: 'Empaque Térmico', desc: 'Salsas y control', active: false, done: false },
    { title: 'En Camino / Listo', desc: 'Repartidor asignado', active: false, done: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-[#181818] rounded-3xl border border-[#2D2D2D] shadow-2xl overflow-hidden my-auto">
        {/* Celebration Header */}
        <div className="bg-gradient-to-br from-[#D32F2F] to-[#8E0000] p-6 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF9800]/30 rounded-full blur-2xl" />
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center border border-white/20 mb-3 shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
            ¡Comanda Recibida con Éxito!
          </h2>
          <p className="text-xs text-white/90 mt-1">
            Tu pedido ya está siendo preparado en los fuegos de Las Flamas
          </p>

          <div className="inline-block mt-3 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-mono font-bold text-[#FFC107] border border-[#FFC107]/30 tracking-wider">
            Ticket: #{ticketId}
          </div>
        </div>

        {/* Status Stepper */}
        <div className="p-5 bg-[#141414] border-b border-[#242424]">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-3">
            <span className="flex items-center gap-1 font-semibold text-white">
              <Clock className="w-3.5 h-3.5 text-[#FFC107]" />
              Tiempo Estimado: {RESTAURANT_INFO.deliveryTime}
            </span>
            <span className="text-emerald-400 font-medium">En proceso</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                    step.done
                      ? 'bg-emerald-500 text-black shadow-md'
                      : step.active
                      ? 'bg-[#E53935] text-white animate-pulse'
                      : 'bg-[#262626] text-stone-500'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-[10px] font-semibold text-stone-300 leading-tight">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-5 space-y-4 max-h-[38vh] overflow-y-auto text-xs text-stone-300 divide-y divide-[#242424]">
          {/* Customer & Delivery Mode */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-400">Cliente:</span>
              <span className="text-white font-medium">{orderDetails.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">WhatsApp:</span>
              <span className="text-white font-medium">{orderDetails.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Modalidad:</span>
              <span className="text-amber-400 font-bold uppercase">
                {orderDetails.deliveryType === 'delivery'
                  ? 'Delivery a Domicilio'
                  : orderDetails.deliveryType === 'takeaway'
                  ? 'Retiro en Local'
                  : `En Mesa #${orderDetails.tableNumber}`}
              </span>
            </div>
            {orderDetails.deliveryType === 'delivery' && (
              <div className="flex justify-between">
                <span className="text-stone-400">Dirección:</span>
                <span className="text-white font-medium text-right max-w-[240px]">
                  {orderDetails.address}
                </span>
              </div>
            )}
          </div>

          {/* Itemized list */}
          <div className="pt-3 space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Productos Solicitados ({items.length})
            </span>
            {items.map((it) => (
              <div key={it.cartItemId} className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <span className="text-white font-semibold">
                    {it.quantity}x {it.product.name}
                  </span>
                  <div className="text-[10px] text-stone-400 flex flex-wrap gap-1 mt-0.5">
                    {it.selectedCookingPoint && <span>• {it.selectedCookingPoint.split('(')[0]}</span>}
                    {it.selectedSpicyLevel !== undefined && <span>• 🌶️ Nivel {it.selectedSpicyLevel}</span>}
                    {it.selectedSauce && <span>• {it.selectedSauce}</span>}
                    {it.selectedSide && <span>• {it.selectedSide}</span>}
                  </div>
                </div>
                <span className="text-[#FFC107] font-bold tabular-nums">
                  {RESTAURANT_INFO.currency} {it.itemTotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total Breakdown */}
          <div className="pt-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-400">Subtotal</span>
              <span className="text-white tabular-nums">
                {RESTAURANT_INFO.currency} {subtotal.toFixed(2)}
              </span>
            </div>
            {orderDetails.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Descuento aplicado</span>
                <span className="tabular-nums">
                  -{RESTAURANT_INFO.currency} {orderDetails.discount.toFixed(2)}
                </span>
              </div>
            )}
            {orderDetails.deliveryType === 'delivery' && (
              <div className="flex justify-between">
                <span className="text-stone-400">Envío</span>
                <span className="tabular-nums">
                  {deliveryFee === 0 ? 'GRATIS' : `${RESTAURANT_INFO.currency} ${deliveryFee.toFixed(2)}`}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-[#2A2A2A]">
              <span>Total Comanda</span>
              <span className="text-[#FFC107] text-base tabular-nums">
                {RESTAURANT_INFO.currency} {grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 sm:p-5 bg-[#141414] border-t border-[#242424] flex flex-col sm:flex-row gap-2">
          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-black font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Phone className="w-4 h-4 fill-black" />
            <span>Hablar con el Restaurante</span>
          </a>

          <button
            onClick={() => {
              onResetOrder();
              onClose();
            }}
            className="py-3 px-4 rounded-xl bg-[#262626] hover:bg-[#303030] text-stone-200 hover:text-white font-bold text-xs sm:text-sm transition-colors text-center cursor-pointer"
          >
            Hacer Nuevo Pedido
          </button>
        </div>
      </div>
    </div>
  );
};
