import React from 'react';
import { Flame, Clock, MapPin, Phone, ShieldCheck, Heart, QrCode, CreditCard, Banknote } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData.ts';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#222222] pt-10 pb-24 sm:pb-12 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#FFC107] bg-black shrink-0">
              <img
                src={RESTAURANT_INFO.logo}
                alt={RESTAURANT_INFO.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <span className="text-lg font-black text-white font-['Outfit'] block">
                {RESTAURANT_INFO.name}
              </span>
              <span className="text-[11px] text-[#FFC107] font-semibold">
                Carnes, Parrillas y Alitas
              </span>
            </div>
          </div>
          <p className="text-stone-400 text-xs leading-relaxed">
            {RESTAURANT_INFO.slogan}. Pasión por el asado a fuego vivo con carbón de quebracho y salsas exclusivas preparadas a mano.
          </p>
        </div>

        {/* Schedule & Contact */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#E53935]" />
            Horarios de Atención
          </h4>
          <p className="text-stone-300">
            Martes a Domingo
          </p>
          <p className="text-white font-semibold">
            12:00 PM – 11:30 PM
          </p>
          <p className="text-stone-500 text-[11px]">
            *Lunes cerrado por mantenimiento de hornos y brasas
          </p>
        </div>

        {/* Location & Delivery */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#E53935]" />
            Ubicación & Delivery
          </h4>
          <p className="text-stone-300">
            {RESTAURANT_INFO.address}
          </p>
          <p className="text-stone-400">
            Cobertura rápida de entregas en 35 a 45 minutos en caja térmica.
          </p>
          <div className="pt-1">
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#25D366] font-semibold hover:underline"
            >
              <Phone className="w-3 h-3" />
              WhatsApp: {RESTAURANT_INFO.whatsappDisplay}
            </a>
          </div>
        </div>

        {/* Methods & Guarantees */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFC107]" />
            Medios de Pago Aceptados
          </h4>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-stone-200">
              <Banknote className="w-3.5 h-3.5 text-emerald-400" />
              Efectivo
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-stone-200">
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              QR Simple
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-stone-200">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              Tarjetas Débito / Crédito
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
        <div>
          © {new Date().getFullYear()} {RESTAURANT_INFO.name}. Todos los derechos reservados.
        </div>
        <div className="flex items-center gap-1">
          <span>Hecho con</span>
          <Flame className="w-3 h-3 text-[#E53935] fill-[#E53935]" />
          <span>y brasas para amantes del buen comer</span>
        </div>
      </div>
    </footer>
  );
};
