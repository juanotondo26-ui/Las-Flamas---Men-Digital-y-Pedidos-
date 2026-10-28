import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { FoodBanner } from './components/FoodBanner.tsx';
import { CategoryGrid2Col } from './components/CategoryGrid2Col.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { ReceiptModal } from './components/ReceiptModal.tsx';
import { Footer } from './components/Footer.tsx';
import { CATEGORIES, PRODUCTS, RESTAURANT_INFO } from './data/menuData.ts';
import { Product, CartItem, DeliveryType, OrderDetails } from './types.ts';
import { Flame, ShoppingCart, ArrowRight, ArrowLeft, X, Layers } from 'lucide-react';

export default function App() {
  // Navigation & Filtering States
  // null = Main screen showing 2-column categories grid; string = Active category view with submenus & products
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  // Filtered products list when a category or search is active
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

    if (!activeCategoryId) {
      return [];
    }

    // Category filter
    list = list.filter((p) => p.categoryId === activeCategoryId);

    // Subcategory filter
    if (selectedSubcategory !== 'Todos') {
      list = list.filter((p) => p.subcategory === selectedSubcategory);
    }

    return list;
  }, [searchQuery, activeCategoryId, selectedSubcategory]);

  // Active Category Object
  const currentCategory = useMemo(() => {
    if (!activeCategoryId) return null;
    return CATEGORIES.find((c) => c.id === activeCategoryId) || null;
  }, [activeCategoryId]);

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

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setSelectedSubcategory('Todos');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleBackToCategories = () => {
    setActiveCategoryId(null);
    setSelectedSubcategory('Todos');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0] flex flex-col selection:bg-[#E53935] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1E1E1E]/95 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-2xl border border-[#E53935]/50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Flame className="w-4 h-4 text-[#FFC107] fill-[#FFC107]" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header with Las Flamas Title & ShoppingCart Isotipo */}
      <Header
        cartItemCount={cartItemCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategoryName={currentCategory ? currentCategory.name : 'Menú Principal'}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* 2. Banner grande con foto de comida llamativa (después del título de Las Flamas) */}
        {!searchQuery && (
          <FoodBanner />
        )}

        {/* Search Results View */}
        {searchQuery ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E]">
              <span className="text-xs sm:text-sm text-stone-300">
                Resultados para: <strong className="text-white font-bold">"{searchQuery}"</strong> ({filteredProducts.length})
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#FFC107] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <span>Cerrar búsqueda</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#282828] p-10 text-center space-y-3">
                <Flame className="w-8 h-8 text-[#E53935] mx-auto animate-pulse" />
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  No se encontraron platos
                </h3>
                <p className="text-xs text-stone-400">
                  Intenta con otro término como hamburguesas, costillas, alitas o bebidas.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-[#E53935] text-white text-xs font-bold rounded-xl"
                >
                  Ver Menú
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
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
        ) : activeCategoryId === null ? (
          /* 3. Pantalla Principal: SOLO LAS CATEGORÍAS EN 2 COLUMNAS (Sin submenús) */
          <CategoryGrid2Col
            categories={CATEGORIES}
            onSelectCategory={handleCategoryClick}
            productCounts={productCounts}
          />
        ) : (
          /* 4. Vista de Categoría Activa: Se activan los submenús y platos al hacer clic */
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Navigation Bar to Return to Categories */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1A1A1A] p-3 sm:p-4 rounded-2xl border border-[#2B2B2B]">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleBackToCategories}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#242424] hover:bg-[#303030] text-stone-200 hover:text-white text-xs font-bold border border-stone-700 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4 text-[#FFC107]" />
                  <span>Volver a Categorías</span>
                </button>

                <div className="h-5 w-[1px] bg-stone-700 hidden sm:block" />

                <h2 className="text-base sm:text-xl font-black text-white font-['Outfit'] flex items-center gap-1.5 truncate">
                  <span>{currentCategory?.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-black/40 text-[#FFC107] font-mono tabular-nums border border-white/10">
                    {filteredProducts.length}
                  </span>
                </h2>
              </div>

              {/* Submenus interactive chips (solo activos al ingresar a la categoría) */}
              {currentCategory && currentCategory.subcategories.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
                  {currentCategory.subcategories.map((sub) => {
                    const isSubActive = selectedSubcategory === sub;
                    return (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer border ${
                          isSubActive
                            ? 'bg-[#E53935] text-white border-[#FF6859]/50 font-bold shadow-md shadow-[#E53935]/25'
                            : 'bg-[#141414] text-stone-400 hover:text-stone-200 hover:bg-[#202020] border-[#262626]'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product Grid of the Selected Category */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
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
          </div>
        )}
      </main>

      {/* Floating Bottom Bar (Fixed at bottom when cart has items) */}
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
                    <ShoppingCart className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 bg-[#FFC107] text-black font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border border-black shadow">
                    {cartItemCount}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-sm sm:text-base font-extrabold tracking-tight block">
                    Ver Mi Pedido ({cartItemCount} {cartItemCount === 1 ? 'ítem' : 'ítems'})
                  </span>
                  <span className="text-xs text-white/90 font-medium">
                    {deliveryType === 'delivery' ? '🛵 Con entrega rápida' : '🏬 Listo para retirar'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right">
                  <span className="text-xs text-white/90 uppercase font-bold block">Total</span>
                  <span className="text-lg sm:text-xl font-black text-[#FFC107] tabular-nums font-['Outfit']">
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
