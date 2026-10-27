import React from 'react';
import { ChevronRight, Flame } from 'lucide-react';
import { Category } from '../types.ts';

interface CategoryGrid2ColProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  productCounts: Record<string, number>;
}

export const CategoryGrid2Col: React.FC<CategoryGrid2ColProps> = ({
  categories,
  onSelectCategory,
  productCounts,
}) => {
  return (
    <div className="space-y-3.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-black text-white font-['Outfit'] flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-[#E53935] fill-[#E53935]" />
            Menú Principal
          </span>
          <span className="text-xs text-stone-400 font-mono">({categories.length})</span>
        </div>
        <span className="text-xs text-stone-400">
          Toca una categoría para ver sus opciones
        </span>
      </div>

      {/* 2-Column Vertical Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {categories.map((category) => {
          const totalPlates = productCounts[category.id] || 0;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#1A1A1A] hover:bg-[#222222] border border-[#2B2B2B] hover:border-[#E53935]/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#E53935]/15 text-left cursor-pointer active:scale-[0.98]"
            >
              {/* Category Characteristic Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-black/30 to-black/10 pointer-events-none" />

                <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/60 group-hover:bg-[#E53935] text-white flex items-center justify-center transition-all shadow border border-white/10 group-hover:border-transparent">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Title & Info */}
              <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white font-['Outfit'] tracking-tight group-hover:text-[#FFC107] transition-colors line-clamp-1 leading-snug">
                    {category.name}
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5 font-medium">
                    {totalPlates} {totalPlates === 1 ? 'plato disponible' : 'platos disponibles'}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-[#262626] flex items-center justify-between text-[11px] text-stone-400 group-hover:text-stone-300">
                  <span>Explorar menú</span>
                  <span className="text-[#E53935] font-bold">Ver →</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
