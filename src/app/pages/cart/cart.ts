import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class CartPageComponent {
  readonly cartService = inject(CartService);
  readonly showPaymentModal = signal(false);
  readonly selectedPaymentMethod = signal<'credit-card' | 'debit-card' | 'wallet' | 'cash'>('credit-card');

  readonly paymentMethods = [
    { id: 'credit-card', name: 'Credit Card', icon: 'bi-credit-card', description: 'Visa, Mastercard, American Express' },
    { id: 'debit-card', name: 'Debit Card', icon: 'bi-credit-card', description: 'Direct from your bank account' },
    { id: 'wallet', name: 'Digital Wallet', icon: 'bi-wallet2', description: 'Apple Pay, Google Pay, PayPal' },
    { id: 'cash', name: 'Cash on Delivery', icon: 'bi-cash-coin', description: 'Pay when you receive your order' },
  ] as const;

  increase(productId: number): void {
    const item = this.cartService.items().find((entry) => entry.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrease(productId: number): void {
    const item = this.cartService.items().find((entry) => entry.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  openPaymentModal(): void {
    this.showPaymentModal.set(true);
  }

  closePaymentModal(): void {
    this.showPaymentModal.set(false);
  }

  proceedToCheckout(): void {
    const method = this.selectedPaymentMethod();
    console.log(`Proceeding with ${method}`);
    alert(`Proceeding to checkout with ${this.paymentMethods.find((m) => m.id === method)?.name}`);
    this.closePaymentModal();
  }
}
