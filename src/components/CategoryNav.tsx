import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Flame, Layers } from 'lucide-react';
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
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const currentCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  return (
    <div className="sticky top-[108px] sm:top-[73px] z-30 bg-[#121212]/95 backdrop-blur-md pb-3 pt-2 border-b border-[#242424] -mx-4 px-4 sm:mx-0 sm:px-0">
      {/* Category Pills Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#E53935]" />
            Categorías del Menú
          </span>
          <span className="text-xs text-stone-400">({categories.length})</span>
        </div>

        {/* Scroll Arrows on Desktop */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] text-stone-300 hover:text-white border border-[#2E2E2E] transition-colors"
            aria-label="Desplazar categorías a la izquierda"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] text-stone-300 hover:text-white border border-[#2E2E2E] transition-colors"
            aria-label="Desplazar categorías a la derecha"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Categories Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {categories.map((category) => {
          const isSelected = category.id === selectedCategoryId;
          const count = productCounts[category.id] || 0;

          return (
            <button
              key={category.id}
              onClick={() => {
                onSelectCategory(category.id);
                onSelectSubcategory('Todos');
              }}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 cursor-pointer whitespace-nowrap border ${
                isSelected
                  ? 'bg-gradient-to-r from-[#D32F2F] to-[#E53935] text-white border-[#FF6859]/50 shadow-lg shadow-[#E53935]/25 font-bold scale-[1.02]'
                  : 'bg-[#1E1E1E] text-stone-300 hover:text-white hover:bg-[#282828] border-[#2A2A2A]'
              }`}
              style={{ scrollSnapAlign: 'start' }}
            >
              <span className="text-base sm:text-lg leading-none">{category.emoji}</span>
              <span className="tracking-tight">{category.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono tabular-nums ${
                  isSelected
                    ? 'bg-black/30 text-white'
                    : 'bg-[#141414] text-stone-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subcategory Interactive Submenu Bar */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-[#222222] flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-400 shrink-0 hidden sm:flex">
            <Layers className="w-3 h-3 text-[#FF9800]" />
            <span>Filtro:</span>
          </div>

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
                  className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition-all whitespace-nowrap cursor-pointer border ${
                    isSubActive
                      ? 'bg-[#FF9800]/20 text-[#FFC107] border-[#FF9800]/40 font-semibold shadow-sm'
                      : 'bg-[#1A1A1A] text-stone-400 hover:text-stone-200 hover:bg-[#242424] border-transparent'
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
