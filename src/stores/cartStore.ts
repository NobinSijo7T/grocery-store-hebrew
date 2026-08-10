// ============================================================
// Cart Store — Zustand with Optimistic Updates
// ============================================================

import { create } from 'zustand';
import type { LocalCartItem, Product } from '@/types/models';
import { ENV } from '@/lib/env';

interface CartState {
  items: LocalCartItem[];
  isOpen: boolean;

  // Computed
  itemCount: () => number;
  subtotal: () => number;
  deliveryFee: () => number;
  total: () => number;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setOpen: (open: boolean) => void;
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  // Computed getters
  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
  subtotal: () =>
    get().items.reduce((sum, item) => {
      const price = item.product.discount_price ?? item.product.price;
      return sum + price * item.quantity;
    }, 0),
  deliveryFee: () => {
    const subtotal = get().subtotal();
    return subtotal >= ENV.FREE_DELIVERY_THRESHOLD ? 0 : ENV.DELIVERY_FEE;
  },
  total: () => get().subtotal() + get().deliveryFee(),

  // Actions
  addItem: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { productId: product.id, product, quantity }],
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.productId !== productId) };
      }
      return {
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        ),
      };
    }),

  incrementItem: (productId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
      ),
    })),

  decrementItem: (productId) =>
    set((state) => {
      const item = state.items.find((i) => i.productId === productId);
      if (item && item.quantity <= 1) {
        return { items: state.items.filter((i) => i.productId !== productId) };
      }
      return {
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    }),

  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (isOpen) => set({ isOpen }),

  getItemQuantity: (productId) => {
    const item = get().items.find((i) => i.productId === productId);
    return item?.quantity ?? 0;
  },
}));
