import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css'],
})
export class WishlistPageComponent {
  readonly wishlistService = inject(WishlistService);
  readonly cartService = inject(CartService);

  moveToCart(product: any): void {
    this.cartService.addToCart(product);
    this.wishlistService.remove(product.id);
  }
}
