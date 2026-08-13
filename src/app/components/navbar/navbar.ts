import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly cartCount = this.cartService.count;
  readonly wishlistCount = this.wishlistService.count;
  readonly currentUser = this.authService.currentUser;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isAdmin = this.authService.userRole;
  readonly userDisplayName = computed(() => {
    const name = this.currentUser()?.name ?? '';
    return name.trim().split(' ')[0] || 'User';
  });

  searchTerm = '';
  suggestions: Product[] = [];

  search(): void {
    if (!this.searchTerm.trim()) {
      this.suggestions = [];
      return;
    }

    this.productService.searchProducts(this.searchTerm).subscribe((response) => {
      this.suggestions = response.products.slice(0, 5);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
