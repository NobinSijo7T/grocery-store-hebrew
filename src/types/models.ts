// ============================================================
// TypeScript Types — Database Models
// ============================================================

export type OrderStatus = 'pending' | 'confirmed' | 'packing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
export type UserRole = 'customer' | 'admin' | 'staff';

export interface Category {
  id: string;
  name_he: string;
  slug: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name_he: string;
  slug: string;
  description_he: string | null;
  price: number;
  unit: string;
  discount_price: number | null;
  image_url: string | null;
  gallery_urls: string[];
  stock_qty: number;
  is_featured: boolean;
  is_offer: boolean;
  is_active: boolean;
  is_organic: boolean;
  seasonal_tag: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
}

export interface Customer {
  id: string;
  auth_user_id: string;
  full_name: string | null;
  phone: string | null;
  default_address: string | null;
  role: UserRole;
  created_at: string;
}

export interface Address {
  id: string;
  customer_id: string;
  label: string;
  street: string;
  city: string;
  notes: string | null;
  is_default: boolean;
  created_at: string;
}

export interface Cart {
  id: string;
  customer_id: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price_snapshot: number;
  // Joined fields
  product?: Product;
}

export interface Order {
  id: string;
  customer_id: string;
  address_id: string | null;
  subtotal: number;
  delivery_fee: number;
  discount_total: number;
  grand_total: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  delivery_status: DeliveryStatus;
  delivery_slot: string | null;
  coupon_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  customer?: Customer;
  address?: Address;
  items?: OrderItem[];
  delivery?: Delivery;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name_snapshot: string;
  unit_snapshot: string;
  price_snapshot: number;
  quantity: number;
  // Joined fields
  product?: Product;
}

export interface Delivery {
  id: string;
  order_id: string;
  driver_name: string | null;
  driver_phone: string | null;
  status: DeliveryStatus;
  tracking_note: string | null;
  eta: string | null;
  updated_at: string;
}

export interface Banner {
  id: string;
  title_he: string;
  subtitle_he: string | null;
  image_url: string | null;
  link_type: 'category' | 'product' | 'offer' | 'none';
  link_value: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Offer {
  id: string;
  title_he: string;
  description_he: string | null;
  banner_image_url: string | null;
  discount_percent: number | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Favorite {
  id: string;
  customer_id: string;
  product_id: string;
  created_at: string;
  // Joined fields
  product?: Product;
}

// -------------------------
// Filters & Sorting
// -------------------------
export type SortOption = 'price_asc' | 'price_desc' | 'popular' | 'newest';

export interface ProductFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  organicOnly?: boolean;
  seasonalOnly?: boolean;
  isFeatured?: boolean;
  isOffer?: boolean;
  sort?: SortOption;
}

// -------------------------
// Cart Local State
// -------------------------
export interface LocalCartItem {
  productId: string;
  product: Product;
  quantity: number;
}
