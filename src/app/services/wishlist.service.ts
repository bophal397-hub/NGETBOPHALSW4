import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product';


@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  readonly items = signal<Product[]>([]);

  toggle(product: Product): void {
    const exists = this.items().some((item) => item.id === product.id);
    if (exists) {
      this.items.set(this.items().filter((item) => item.id !== product.id));
      return;
    }

    this.items.set([...this.items(), product]);
  }

  remove(productId: number): void {
    this.items.set(this.items().filter((item) => item.id !== productId));
  }

  clear(): void {
    this.items.set([]);
  }

  isWishlisted(productId: number): boolean {
    return this.items().some((item) => item.id === productId);
  }

  readonly count = computed(() => this.items().length);
}
