import React, { useState } from 'react';
import { X, Send, Copy, Check, QrCode, CreditCard, Banknote, MapPin, Phone, User, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import { CartItem, DeliveryType, PaymentMethod, OrderDetails } from '../types.ts';
import { RESTAURANT_INFO } from '../data/menuData.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  deliveryType: DeliveryType;
  discountAmount: number;
  promoCode: string;
  onOrderCompleted: (details: OrderDetails, generatedTicketId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  deliveryType: initialDeliveryType,
  discountAmount,
  promoCode,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  const [deliveryType, setDeliveryType] = useState<DeliveryType>(initialDeliveryType);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressReference, setAddressReference] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [cashAmountForChange, setCashAmountForChange] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [formError, setFormError] = useState('');
  const [copied, setCopied] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryFee = deliveryType === 'delivery' ? (subtotal >= RESTAURANT_INFO.freeDeliveryThreshold ? 0 : RESTAURANT_INFO.deliveryCost) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  // Generate clean WhatsApp Comanda
  const generateWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push(`🔥 *¡NUEVO PEDIDO - LAS FLAMAS!* 🔥`);
    lines.push(`_Siente el calor, saborea la pasión_`);
    lines.push(``);
    lines.push(`👤 *Cliente:* ${customerName.trim() || 'No especificado'}`);
    lines.push(`📱 *WhatsApp:* ${customerPhone.trim() || 'No especificado'}`);
    
    if (deliveryType === 'delivery') {
      lines.push(`🛵 *Modalidad:* DELIVERY A DOMICILIO`);
      lines.push(`📍 *Dirección:* ${address.trim() || 'Pendiente'}`);
      if (addressReference.trim()) {
        lines.push(`🧭 *Referencia:* ${addressReference.trim()}`);
      }
    } else if (deliveryType === 'takeaway') {
      lines.push(`🏬 *Modalidad:* RETIRO EN LOCAL`);
    } else {
      lines.push(`🍽️ *Modalidad:* CONSUMO EN RESTAURANTE`);
      lines.push(`🪑 *Mesa:* ${tableNumber.trim() || 'Por asignar'}`);
    }

    lines.push(``);
    lines.push(`📋 *DETALLE DE LA COMANDA:*`);
    items.forEach((item, index) => {
      lines.push(`${index + 1}. *${item.quantity}x ${item.product.name}* — ${RESTAURANT_INFO.currency} ${item.itemTotal.toFixed(2)}`);
      if (item.selectedCookingPoint) {
        lines.push(`   🥩 Término: ${item.selectedCookingPoint.split('(')[0].trim()}`);
      }
      if (item.selectedSpicyLevel !== undefined) {
        const pic = item.selectedSpicyLevel === 0 ? 'Sin picante' : `Nivel ${item.selectedSpicyLevel}`;
        lines.push(`   🌶️ Picante: ${pic}`);
      }
      if (item.selectedSauce) {
        lines.push(`   🥣 Salsa: ${item.selectedSauce}`);
      }
      if (item.selectedSide) {
        lines.push(`   🍟 Guarnición: ${item.selectedSide}`);
      }
      if (item.notes) {
        lines.push(`   📝 Nota: "${item.notes}"`);
      }
    });

    lines.push(``);
    lines.push(`💰 *RESUMEN DE PAGO:*`);
    lines.push(`• Subtotal: ${RESTAURANT_INFO.currency} ${subtotal.toFixed(2)}`);
    if (discountAmount > 0) {
      lines.push(`• Descuento (${promoCode}): -${RESTAURANT_INFO.currency} ${discountAmount.toFixed(2)}`);
    }
    if (deliveryType === 'delivery') {
      lines.push(`• Costo de Envío: ${deliveryFee === 0 ? 'GRATIS' : `${RESTAURANT_INFO.currency} ${deliveryFee.toFixed(2)}`}`);
    }
    lines.push(`*TOTAL A PAGAR: ${RESTAURANT_INFO.currency} ${grandTotal.toFixed(2)}*`);

    lines.push(``);
    if (paymentMethod === 'efectivo') {
      lines.push(`💵 *Método de Pago:* Efectivo al recibir`);
      if (cashAmountForChange.trim()) {
        lines.push(`💵 *Paga con:* ${RESTAURANT_INFO.currency} ${cashAmountForChange.trim()} (llevar cambio)`);
      }
    } else if (paymentMethod === 'qr') {
      lines.push(`📱 *Método de Pago:* QR Simple Bancario (solicito código QR)`);
    } else {
      lines.push(`💳 *Método de Pago:* Tarjeta Débito/Crédito (llevar POS)`);
    }

    if (specialInstructions.trim()) {
      lines.push(``);
      lines.push(`📌 *Observaciones:* ${specialInstructions.trim()}`);
    }

    lines.push(``);
    lines.push(`¡Muchas gracias por elegir Las Flamas! 🔥`);
    return lines.join('\n');
  };

  const handleCopyComanda = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateAndProceed = (): boolean => {
    if (!customerName.trim()) {
      setFormError('Por favor ingresa tu nombre y apellido.');
      return false;
    }
    if (!customerPhone.trim()) {
      setFormError('Por favor ingresa tu número de WhatsApp para confirmar.');
      return false;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setFormError('Por favor ingresa tu dirección para el envío.');
      return false;
    }
    if (deliveryType === 'dinein' && !tableNumber.trim()) {
      setFormError('Por favor indica tu número de mesa.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSendWhatsApp = () => {
    if (!validateAndProceed()) return;

    const ticketId = `FLAMAS-${Math.floor(1000 + Math.random() * 9000)}`;
    const text = generateWhatsAppMessage();
    const encoded = encodeURIComponent(text);
    const cleanNumber = RESTAURANT_INFO.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encoded}`;

    const orderData: OrderDetails = {
      customerName,
      customerPhone,
      deliveryType,
      address,
      addressReference,
      tableNumber,
      paymentMethod,
      cashAmountForChange,
      specialInstructions,
      promoCode,
      discount: discountAmount,
    };

    // Open WhatsApp
    window.open(url, '_blank');

    // Trigger local completion receipt
    onOrderCompleted(orderData, ticketId);
  };

  const handleSimulateInApp = () => {
    if (!validateAndProceed()) return;
    const ticketId = `FLAMAS-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData: OrderDetails = {
      customerName,
      customerPhone,
      deliveryType,
      address,
      addressReference,
      tableNumber,
      paymentMethod,
      cashAmountForChange,
      specialInstructions,
      promoCode,
      discount: discountAmount,
    };
    onOrderCompleted(orderData, ticketId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl bg-[#161616] rounded-2xl sm:rounded-3xl border border-[#2A2A2A] shadow-2xl flex flex-col my-auto max-h-[94vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#242424] bg-[#1A1A1A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white shadow-md">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                Confirmación de Pedido por WhatsApp
              </h2>
              <p className="text-xs text-stone-400">
                Se enviará la comanda directa a la cocina de Las Flamas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#242424] hover:bg-[#2C2C2C] text-stone-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {formError && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Delivery Type Tabs */}
          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Tipo de Entrega
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`py-2 px-3 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                  deliveryType === 'delivery'
                    ? 'bg-[#E53935]/25 border-[#E53935] text-white font-bold'
                    : 'bg-[#1E1E1E] border-[#2A2A2A] text-stone-400 hover:text-white'
                }`}
              >
                🛵 Domicilio
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('takeaway')}
                className={`py-2 px-3 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                  deliveryType === 'takeaway'
                    ? 'bg-[#E53935]/25 border-[#E53935] text-white font-bold'
                    : 'bg-[#1E1E1E] border-[#2A2A2A] text-stone-400 hover:text-white'
                }`}
              >
                🏬 Para Llevar
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('dinein')}
                className={`py-2 px-3 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                  deliveryType === 'dinein'
                    ? 'bg-[#E53935]/25 border-[#E53935] text-white font-bold'
                    : 'bg-[#1E1E1E] border-[#2A2A2A] text-stone-400 hover:text-white'
                }`}
              >
                🍽️ En Restaurante
              </button>
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-[#FFC107]" />
                Nombre Completo *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full bg-[#1E1E1E] border border-[#2C2C2C] rounded-xl px-3 py-2 text-white placeholder-stone-400 focus:outline-none focus:border-[#E53935]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#25D366]" />
                Número de WhatsApp *
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ej. 70012345"
                className="w-full bg-[#1E1E1E] border border-[#2C2C2C] rounded-xl px-3 py-2 text-white placeholder-stone-400 focus:outline-none focus:border-[#E53935]"
              />
            </div>
          </div>

          {/* Address if delivery */}
          {deliveryType === 'delivery' && (
            <div className="space-y-3 bg-[#1C1C1C] p-3 rounded-xl border border-[#282828]">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#E53935]" />
                  Dirección de Entrega *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, Avenida, Número de casa o condominio"
                  className="w-full bg-[#161616] border border-[#2C2C2C] rounded-xl px-3 py-2 text-white placeholder-stone-400 focus:outline-none focus:border-[#E53935]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Referencia de Ubicación
                </label>
                <input
                  type="text"
                  value={addressReference}
                  onChange={(e) => setAddressReference(e.target.value)}
                  placeholder="Ej. Casa verde portón negro, frente al parque"
                  className="w-full bg-[#161616] border border-[#2C2C2C] rounded-xl px-3 py-2 text-white placeholder-stone-400 focus:outline-none focus:border-[#E53935]"
                />
              </div>
            </div>
          )}

          {/* Table number if dine-in */}
          {deliveryType === 'dinein' && (
            <div className="bg-[#1C1C1C] p-3 rounded-xl border border-[#282828]">
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Número de Mesa *
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Ej. Mesa 4 o Barra"
                className="w-full bg-[#161616] border border-[#2C2C2C] rounded-xl px-3 py-2 text-white placeholder-stone-400 focus:outline-none focus:border-[#E53935]"
              />
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Método de Pago
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('efectivo')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  paymentMethod === 'efectivo'
                    ? 'bg-[#FF9800]/20 border-[#FF9800] text-white font-bold'
                    : 'bg-[#1E1E1E] border-[#2A2A2A] text-stone-400 hover:text-white'
                }`}
              >
                <Banknote className="w-4 h-4 mb-1 text-emerald-400" />
                <span className="text-xs">Efectivo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('qr')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  paymentMethod === 'qr'
                    ? 'bg-[#FF9800]/20 border-[#FF9800] text-white font-bold'
                    : 'bg-[#1E1E1E] border-[#2A2A2A] text-stone-400 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4 mb-1 text-cyan-400" />
                <span className="text-xs">Pago QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('tarjeta')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  paymentMethod === 'tarjeta'
                    ? 'bg-[#FF9800]/20 border-[#FF9800] text-white font-bold'
                    : 'bg-[#1E1E1E] border-[#2A2A2A] text-stone-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4 mb-1 text-amber-400" />
                <span className="text-xs">Tarjeta (POS)</span>
              </button>
            </div>

            {paymentMethod === 'efectivo' && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={cashAmountForChange}
                  onChange={(e) => setCashAmountForChange(e.target.value)}
                  placeholder="¿Con cuánto dinero pagarás? (Ej: Pagaré con 200 Bs)"
                  className="w-full bg-[#1E1E1E] border border-[#2C2C2C] rounded-xl px-3 py-2 text-white placeholder-stone-400 focus:outline-none focus:border-[#FF9800]"
                />
              </div>
            )}

            {paymentMethod === 'qr' && (
              <div className="mt-2.5 p-3 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center shrink-0">
                  <QrCode className="w-10 h-10 text-black" />
                </div>
                <div className="text-[11px] text-stone-300">
                  <span className="font-bold text-white block">QR Simple Bancario</span>
                  El código QR oficial te será enviado inmediatamente por WhatsApp al recibir tu comanda.
                </div>
              </div>
            )}
          </div>

          {/* Observations */}
          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-stone-400" />
              Observaciones Finales
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Ej: Timbre no funciona, llamar al llegar..."
              className="w-full bg-[#1E1E1E] border border-[#2C2C2C] rounded-xl px-3 py-2 text-white placeholder-stone-400 focus:outline-none focus:border-[#E53935]"
            />
          </div>

          {/* Live Preview Box */}
          <div className="bg-[#121212] rounded-xl p-3 border border-[#242424] space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
              <span className="flex items-center gap-1 text-[#25D366]">
                <Send className="w-3.5 h-3.5" />
                Vista Previa del Mensaje de WhatsApp
              </span>
              <button
                type="button"
                onClick={handleCopyComanda}
                className="text-[11px] text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer bg-[#202020] px-2 py-0.5 rounded border border-[#2E2E2E]"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[10px] text-stone-300 bg-black/60 p-2.5 rounded-lg font-mono whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed border border-[#1E1E1E]">
              {generateWhatsAppMessage()}
            </pre>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="p-4 sm:p-5 bg-[#141414] border-t border-[#242424] flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={handleSimulateInApp}
            className="w-full sm:w-auto px-4 py-3 bg-[#242424] hover:bg-[#2C2C2C] text-stone-200 hover:text-white text-xs font-semibold rounded-xl border border-stone-700 transition-colors"
          >
            Ver Ticket Digital
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#2BF578] hover:to-[#25D366] text-black font-extrabold text-sm shadow-xl shadow-[#25D366]/20 active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 fill-black" />
            <span>Enviar Pedido a WhatsApp</span>
            <span className="bg-black/20 text-black px-2 py-0.5 rounded-md text-xs font-black tabular-nums">
              {RESTAURANT_INFO.currency} {grandTotal.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
