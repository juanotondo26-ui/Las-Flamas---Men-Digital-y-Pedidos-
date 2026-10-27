import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { Category } from '../types.ts';

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  selectedSubcategory: string;
  onSelectSubcategory: (subcategory: string) => void;
  productCounts: Record<string, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
  productCounts,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const subScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const currentCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  return (
    <div className="sticky top-[106px] sm:top-[73px] z-30 bg-[#121212]/95 backdrop-blur-md pb-3 pt-1 border-b border-[#242424] -mx-4 px-4 sm:mx-0 sm:px-0">
      {/* Category Section Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white font-['Outfit'] flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#E53935] fill-[#E53935]" />
            Categorías
          </span>
          <span className="text-xs text-stone-500 font-mono">({categories.length})</span>
        </div>

        {/* Scroll Controls */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#282828] text-stone-300 hover:text-white border border-[#2B2B2B] transition-colors cursor-pointer"
            aria-label="Desplazar a la izquierda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#282828] text-stone-300 hover:text-white border border-[#2B2B2B] transition-colors cursor-pointer"
            aria-label="Desplazar a la derecha"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 10 Interactive Category Chips with Photo, Title & Submenus Count */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {categories.map((category) => {
          const isSelected = category.id === selectedCategoryId;
          // Number of distinct submenus excluding "Todos"
          const submenusCount = category.subcategories.filter((s) => s !== 'Todos').length;

          return (
            <button
              key={category.id}
              onClick={() => {
                onSelectCategory(category.id);
                onSelectSubcategory('Todos');
              }}
              className={`group shrink-0 flex items-center gap-3 p-2 pr-3.5 sm:pr-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#2A1513] via-[#241715] to-[#1C1413] border-[#E53935] shadow-lg shadow-[#E53935]/20 ring-1 ring-[#E53935]'
                  : 'bg-[#1A1A1A] hover:bg-[#222222] border-[#2A2A2A] hover:border-[#383838]'
              }`}
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Category Characteristic Photo */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-[#333333]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-[#E53935]/20 mix-blend-overlay" />
                )}
              </div>

              {/* Title & Submenus Count */}
              <div className="flex flex-col min-w-0 pr-1">
                <span
                  className={`text-xs sm:text-sm font-bold tracking-tight font-['Outfit'] leading-tight truncate ${
                    isSelected ? 'text-white' : 'text-stone-200 group-hover:text-white'
                  }`}
                >
                  {category.name}
                </span>
                <span
                  className={`text-[11px] font-semibold tabular-nums mt-0.5 ${
                    isSelected ? 'text-[#FFC107]' : 'text-stone-400'
                  }`}
                >
                  {submenusCount} {submenusCount === 1 ? 'submenú' : 'submenús'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Submenus Filter Bar for Active Category */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-[#222222] flex items-center gap-2">
          <span className="text-[11px] font-semibold text-stone-400 shrink-0 hidden sm:inline">
            Submenús:
          </span>
          <div
            ref={subScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {currentCategory.subcategories.map((sub) => {
              const isSubActive = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => onSelectSubcategory(sub)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer border ${
                    isSubActive
                      ? 'bg-[#E53935] text-white border-[#FF6859]/50 font-bold shadow-sm'
                      : 'bg-[#1C1C1C] text-stone-400 hover:text-stone-200 hover:bg-[#262626] border-[#292929]'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
