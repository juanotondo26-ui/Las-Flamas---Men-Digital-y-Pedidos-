import React from 'react';
import { Flame, Clock, MapPin, Phone } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData.ts';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#222222] pt-10 pb-24 sm:pb-12 text-stone-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFC107] bg-black shrink-0">
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
              <span className="text-xl font-black text-white font-['Outfit'] block">
                {RESTAURANT_INFO.name}
              </span>
              <span className="text-xs text-[#FFC107] font-semibold">
                Carnes, Parrillas y Alitas
              </span>
            </div>
          </div>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
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

        {/* Location & Contact */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#E53935]" />
            Ubicación & Contacto
          </h4>
          <a
            href="https://maps.google.com/?q=Av.+Las+Am%C3%A9ricas+131"
            target="_blank"
            rel="noreferrer"
            className="text-stone-200 hover:text-[#FFC107] font-medium flex items-center gap-1.5 transition-colors underline decoration-stone-600 hover:decoration-[#FFC107]"
            title="Ver en Google Maps"
          >
            <span>Av. Las Américas 131</span>
          </a>
          <div className="pt-1">
            <a
              href="tel:72877666"
              className="inline-flex items-center gap-1.5 text-[#25D366] hover:text-[#2bf578] font-bold text-xs transition-colors"
              title="Llamar al 72877666"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Celular: 72877666</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-xs">
        <div>
          © {new Date().getFullYear()} {RESTAURANT_INFO.name}. Todos los derechos reservados.
        </div>
        <div className="flex items-center gap-1.5">
          <span>Hecho con</span>
          <Flame className="w-3.5 h-3.5 text-[#E53935] fill-[#E53935]" />
          <span>y brasas para amantes del buen comer</span>
        </div>
      </div>
    </footer>
  );
};
