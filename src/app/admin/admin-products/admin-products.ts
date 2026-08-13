import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-products.html',
  styleUrls: ['./admin-products.css'],
})
export class AdminProductsComponent {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('');
  readonly selectedStock = signal('');
  readonly sortBy = signal('featured');
  readonly currentPage = signal(1);
  readonly pageSize = 8;

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();
    const stock = this.selectedStock();
    const sort = this.sortBy();
    let result = [...this.products()];

    if (term) {
      result = result.filter((product) => `${product.title} ${product.brand} ${product.category}`.toLowerCase().includes(term));
    }

    if (category) {
      result = result.filter((product) => product.category.toLowerCase() === category.toLowerCase());
    }

    if (stock) {
      result = result.filter((product) => {
        if (stock === 'in-stock') return product.stock > 0;
        if (stock === 'low-stock') return product.stock > 0 && product.stock < 10;
        return product.stock === 0;
      });
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'az':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize)));
  readonly pagedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  readonly categories = computed(() => Array.from(new Set(this.products().map((product) => product.category))));

  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts(100).subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  openEdit(productId: number): void {
    this.router.navigate(['/admin/products/edit', productId]);
  }

  deleteProduct(product: Product): void {
    const confirmed = window.confirm(`Delete product "${product.title}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.products.set(this.products().filter((item) => item.id !== product.id));
        alert('Product deleted successfully.');
      },
      error: () => {
        alert('Unable to delete this product. Please try again.');
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.selectedStock.set('');
    this.sortBy.set('featured');
    this.currentPage.set(1);
  }
}
