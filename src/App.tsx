import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { CategoryNav } from './components/CategoryNav.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { ReceiptModal } from './components/ReceiptModal.tsx';
import { Footer } from './components/Footer.tsx';
import { CATEGORIES, PRODUCTS, RESTAURANT_INFO } from './data/menuData.ts';
import { Product, CartItem, DeliveryType, OrderDetails } from './types.ts';
import { Flame, ShoppingBag, ArrowRight, Heart, Sparkles, Filter, Check, X } from 'lucide-react';

export default function App() {
  // Navigation & Filtering States
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(CATEGORIES[0].id);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickFilter, setQuickFilter] = useState<'all' | 'popular' | 'deals' | 'favorites'>('all');

  // Cart & Orders State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('las_flamas_favs');
      return saved ? JSON.parse(saved) : ['hbg-1', 'ali-1', 'cmb-1'];
    } catch {
      return ['hbg-1', 'ali-1', 'cmb-1'];
    }
  });

  // Modals
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
  const [activeTicketId, setActiveTicketId] = useState<string>('');
  const [lastOrderDetails, setLastOrderDetails] = useState<OrderDetails | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem('las_flamas_favs', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Eliminado de tus favoritos' : '¡Guardado en tus favoritos! ❤️');
      return next;
    });
  };

  // Cart count and subtotal
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.itemTotal, 0);
  }, [cartItems]);

  const deliveryFee = useMemo(() => {
    if (deliveryType !== 'delivery') return 0;
    return cartSubtotal >= RESTAURANT_INFO.freeDeliveryThreshold ? 0 : RESTAURANT_INFO.deliveryCost;
  }, [deliveryType, cartSubtotal]);

  const grandTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount + deliveryFee);
  }, [cartSubtotal, discountAmount, deliveryFee]);

  // Product counts per category
  const productCounts = useMemo(() => {
    const map: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      map[cat.id] = PRODUCTS.filter((p) => p.categoryId === cat.id).length;
    });
    return map;
  }, []);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;

    // Search query takes precedence
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      );
    }

    // Quick filters
    if (quickFilter === 'popular') {
      return list.filter((p) => p.isPopular);
    }
    if (quickFilter === 'deals') {
      return list.filter((p) => Boolean(p.originalPrice) || p.categoryId === 'combos');
    }
    if (quickFilter === 'favorites') {
      return list.filter((p) => favorites.includes(p.id));
    }

    // Category filter
    list = list.filter((p) => p.categoryId === selectedCategoryId);

    // Subcategory filter
    if (selectedSubcategory !== 'Todos') {
      list = list.filter((p) => p.subcategory === selectedSubcategory);
    }

    return list;
  }, [searchQuery, quickFilter, selectedCategoryId, selectedSubcategory, favorites]);

  // Featured combo for Hero banner
  const featuredProduct = useMemo(() => {
    return PRODUCTS.find((p) => p.id === 'cmb-1') || PRODUCTS[0];
  }, []);

  // Add customized item to cart
  const handleAddCustomizedItem = (customItem: {
    product: Product;
    quantity: number;
    selectedSpicyLevel?: number;
    selectedSauce?: string;
    selectedSide?: string;
    selectedCookingPoint?: string;
    notes?: string;
    itemTotal: number;
  }) => {
    const cartItemId = `${customItem.product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newItem: CartItem = {
      cartItemId,
      ...customItem,
    };
    setCartItems((prev) => [...prev, newItem]);
    showToast(`¡${customItem.quantity}x ${customItem.product.name} agregado al carrito! 🔥`);
  };

  // Quick add from card (uses defaults)
  const handleQuickAdd = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // If product has complex customization, open modal instead
    if (product.cookingPointOptions || product.hasSpicyOption) {
      setDetailProduct(product);
      return;
    }

    const cartItemId = `${product.id}-${Date.now()}`;
    const newItem: CartItem = {
      cartItemId,
      product,
      quantity: 1,
      selectedSauce: product.sauceOptions?.[0],
      selectedSide: product.sideOptions?.[0],
      itemTotal: product.price,
    };

    setCartItems((prev) => [...prev, newItem]);
    showToast(`¡${product.name} agregado a tu orden! 🍽️`);
  };

  // Update quantity in cart
  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const unitPrice = item.product.price;
          return {
            ...item,
            quantity: newQty,
            itemTotal: unitPrice * newQty,
          };
        }
        return item;
      })
    );
  };

  // Remove single item
  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    showToast('Producto eliminado del pedido');
  };

  // Clear cart
  const handleClearCart = () => {
    setCartItems([]);
    setDiscountAmount(0);
    setPromoCode('');
    showToast('El pedido ha sido vaciado');
  };

  // Promo code validation
  const handleApplyPromoCode = (code: string): boolean => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'FLAMAS10') {
      const discount = cartSubtotal * 0.1;
      setPromoCode('FLAMAS10');
      setDiscountAmount(discount);
      showToast('¡Cupón FLAMAS10 aplicado! 10% de descuento');
      return true;
    }
    if (cleaned === 'BRASA20' && cartSubtotal >= 80) {
      setPromoCode('BRASA20');
      setDiscountAmount(20);
      showToast('¡Cupón BRASA20 aplicado! Bs. 20 de descuento');
      return true;
    }
    return false;
  };

  // Order completion
  const handleOrderCompleted = (details: OrderDetails, ticketId: string) => {
    setLastOrderDetails(details);
    setActiveTicketId(ticketId);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setIsReceiptOpen(true);
    showToast(`¡Comanda #${ticketId} enviada a cocina!`);
  };

  const handleResetOrder = () => {
    setCartItems([]);
    setDiscountAmount(0);
    setPromoCode('');
  };

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0];

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0] flex flex-col selection:bg-[#E53935] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1E1E1E]/95 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-2xl border border-[#E53935]/50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Flame className="w-4 h-4 text-[#FFC107] fill-[#FFC107]" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-stone-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header */}
      <Header
        cartItemCount={cartItemCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategoryName={activeCategory.name}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* 2. Promotional Hero Banner */}
        {!searchQuery && quickFilter === 'all' && (
          <HeroBanner
            featuredProduct={featuredProduct}
            onOrderNow={() => {
              handleQuickAdd(featuredProduct);
              setIsCartOpen(true);
            }}
            onExploreMenu={() => {
              const el = document.getElementById('catalogo-flamas');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {/* Catalog Section Anchor */}
        <div id="catalogo-flamas" className="space-y-4">
          {/* Quick Filters Row (Todos / Populares / Ofertas / Favoritos) */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
            <div className="flex items-center gap-1.5 p-1 bg-[#1A1A1A] rounded-xl border border-[#262626]">
              <button
                onClick={() => {
                  setQuickFilter('all');
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  quickFilter === 'all' && !searchQuery
                    ? 'bg-[#E53935] text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Menú Completo
              </button>
              <button
                onClick={() => {
                  setQuickFilter('popular');
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  quickFilter === 'popular'
                    ? 'bg-[#E53935] text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3 text-[#FFC107]" />
                Más Vendidos
              </button>
              <button
                onClick={() => {
                  setQuickFilter('deals');
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  quickFilter === 'deals'
                    ? 'bg-[#E53935] text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Flame className="w-3 h-3 text-amber-500" />
                Combos & Promos
              </button>
              <button
                onClick={() => {
                  setQuickFilter('favorites');
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  quickFilter === 'favorites'
                    ? 'bg-[#E53935] text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                Favoritos ({favorites.length})
              </button>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#FFC107] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Limpiar búsqueda "{searchQuery}"</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 3. Navigation by Categories (10 interactive buttons) */}
          {!searchQuery && quickFilter === 'all' && (
            <CategoryNav
              categories={CATEGORIES}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              selectedSubcategory={selectedSubcategory}
              onSelectSubcategory={setSelectedSubcategory}
              productCounts={productCounts}
            />
          )}

          {/* Category Title & Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] flex items-center gap-2">
                <span>
                  {searchQuery
                    ? `Resultados para "${searchQuery}"`
                    : quickFilter === 'popular'
                    ? 'Platos Más Populares y Recomendados'
                    : quickFilter === 'deals'
                    ? 'Promociones y Combos Especiales'
                    : quickFilter === 'favorites'
                    ? 'Tus Platos Favoritos Guardados'
                    : `${activeCategory.emoji} ${activeCategory.name}`}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#1F1F1F] text-[#FFC107] font-mono tabular-nums font-semibold border border-[#2E2E2E]">
                  {filteredProducts.length}
                </span>
              </h2>
              {!searchQuery && quickFilter === 'all' && (
                <p className="text-xs text-stone-400 mt-0.5">
                  {activeCategory.shortDesc}
                </p>
              )}
            </div>
          </div>

          {/* 4. Product Bento Grid (2 columns mobile, 3-4 columns desktop) */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#282828] p-10 text-center space-y-3 my-6">
              <div className="w-14 h-14 rounded-full bg-[#242424] flex items-center justify-center mx-auto text-stone-500">
                <Flame className="w-7 h-7 text-stone-600" />
              </div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                No encontramos platos en esta sección
              </h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Prueba buscando otro término o seleccionando otra categoría del menú.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setQuickFilter('all');
                  setSelectedSubcategory('Todos');
                }}
                className="px-4 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 pt-2">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(p, e) => handleQuickAdd(p, e)}
                  onOpenDetail={(p) => setDetailProduct(p)}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 5. Floating Bottom Bar (Fixed at the bottom of the viewport when items in cart) */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#D32F2F] via-[#E53935] to-[#D32F2F] hover:from-[#E53935] hover:to-[#FF6859] text-white font-bold shadow-2xl shadow-[#E53935]/40 border border-[#FF6859]/40 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 bg-[#FFC107] text-black font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border border-black shadow">
                    {cartItemCount}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-xs sm:text-sm font-bold tracking-tight block">
                    Ver Mi Pedido ({cartItemCount} {cartItemCount === 1 ? 'ítem' : 'ítems'})
                  </span>
                  <span className="text-[11px] text-white/80 font-normal">
                    {deliveryType === 'delivery' ? '🛵 Con entrega rápida' : '🏬 Listo para retirar'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-white/80 uppercase font-medium block">Total</span>
                  <span className="text-base sm:text-lg font-black text-[#FFC107] tabular-nums font-['Outfit']">
                    {RESTAURANT_INFO.currency} {grandTotal.toFixed(2)}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddCustomizedItem}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        deliveryType={deliveryType}
        onSetDeliveryType={setDeliveryType}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        promoCode={promoCode}
        onApplyPromoCode={handleApplyPromoCode}
        discountAmount={discountAmount}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        deliveryType={deliveryType}
        discountAmount={discountAmount}
        promoCode={promoCode}
        onOrderCompleted={handleOrderCompleted}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        ticketId={activeTicketId}
        orderDetails={lastOrderDetails}
        items={cartItems}
        onResetOrder={handleResetOrder}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
