export type DeliveryType = 'delivery' | 'takeaway' | 'dinein';

export type PaymentMethod = 'efectivo' | 'qr' | 'tarjeta';

export interface Category {
  id: string;
  name: string;
  emoji: string;
  shortDesc: string;
  subcategories: string[];
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  subcategory: string;
  description: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  image: string;
  hasSpicyOption?: boolean;
  defaultSpicyLevel?: number; // 0 = none, 1 = suave, 2 = medio, 3 = fuego
  sauceOptions?: string[];
  sideOptions?: string[];
  cookingPointOptions?: string[];
  portions?: string;
  rating?: number;
  reviewCount?: number;
  isPopular?: boolean;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedSpicyLevel?: number;
  selectedSauce?: string;
  selectedSide?: string;
  selectedCookingPoint?: string;
  notes?: string;
  itemTotal: number;
}

export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  address: string;
  addressReference: string;
  tableNumber: string;
  paymentMethod: PaymentMethod;
  cashAmountForChange: string;
  specialInstructions: string;
  promoCode?: string;
  discount: number;
}
