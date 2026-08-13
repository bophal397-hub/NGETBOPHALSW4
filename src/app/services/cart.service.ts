import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly items = signal<CartItem[]>([]);

  addToCart(product: Product, quantity = 1): void {
    const currentItems = this.items();
    const existing = currentItems.find((item) => item.product.id === product.id);

    if (existing) {
      this.items.set(
        currentItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
      return;
    }

    this.items.set([...currentItems, { product, quantity }]);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.items.set(
      this.items().map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  }

  removeFromCart(productId: number): void {
    this.items.set(this.items().filter((item) => item.product.id !== productId));
  }

  clearCart(): void {
    this.items.set([]);
  }

  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));

  readonly total = computed(() => this.items().reduce((sum, item) => sum + item.product.price * item.quantity, 0));
}
