import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product';
import { ProductCardComponent } from '../../components/product-card/product-card';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
})
export class ProductDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  readonly product = signal<Product | null>(null);
  readonly relatedProducts = signal<Product[]>([]);
  readonly quantity = signal(1);
  readonly loading = signal(true);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(Number(id));
    }
  }

  private loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.productService.getProductsByCategory(product.category, 4).subscribe({
          next: (response) => this.relatedProducts.set(response.products.filter((item) => item.id !== product.id)),
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  updateQuantity(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    const nextValue = Number(target?.value ?? 1);
    this.quantity.set(Number.isFinite(nextValue) && nextValue > 0 ? nextValue : 1);
  }

  addToCart(): void {
    const item = this.product();
    if (item) {
      this.cartService.addToCart(item, this.quantity());
    }
  }

  toggleWishlist(): void {
    const item = this.product();
    if (item) {
      this.wishlistService.toggle(item);
    }
  }

  isWishlisted(): boolean {
    return !!this.product() && this.wishlistService.isWishlisted(this.product()!.id);
  }
}
