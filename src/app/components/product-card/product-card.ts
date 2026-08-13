import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addedToCart = new EventEmitter<Product>();

  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  addToCart(): void {
    this.cartService.addToCart(this.product);
    this.addedToCart.emit(this.product);
  }

  toggleWishList(): void {
    this.wishlistService.toggle(this.product);
  }

  isWishlisted(): boolean {
    return this.wishlistService.isWishlisted(this.product.id);
  }
}
