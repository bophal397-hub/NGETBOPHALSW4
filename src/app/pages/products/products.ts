import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { CategoryOption, ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class ProductsPageComponent {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<CategoryOption[]>([]);
  readonly loading = signal(true);
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('');
  readonly selectedBrand = signal('');
  readonly selectedPrice = signal('');
  readonly selectedRating = signal('');
  readonly sortBy = signal('featured');
  readonly currentPage = signal(1);
  readonly pageSize = 12;

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();
    const brand = this.selectedBrand();
    const price = this.selectedPrice();
    const rating = this.selectedRating();
    const sort = this.sortBy();
    let result = [...this.products()];

    if (term) {
      result = result.filter((product) => `${product.title} ${product.brand} ${product.category}`.toLowerCase().includes(term));
    }
    if (category) {
      result = result.filter((product) => product.category.toLowerCase() === category.toLowerCase());
    }
    if (brand) {
      result = result.filter((product) => product.brand.toLowerCase() === brand.toLowerCase());
    }
    if (price) {
      const maxPrice = Number(price);
      result = result.filter((product) => product.price <= maxPrice);
    }
    if (rating) {
      const minimumRating = Number(rating);
      result = result.filter((product) => product.rating >= minimumRating);
    }

    switch (sort) {
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
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

  readonly brands = computed(() => Array.from(new Set(this.products().map((product) => product.brand))));

  constructor() {
    this.loadData();
    this.route.queryParamMap.subscribe((params) => {
      const category = params.get('category') || '';
      this.selectedCategory.set(category);
      this.currentPage.set(1);
    });
  }

  private loadData(): void {
    this.productService.getProducts(120).subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });

    this.productService.getCategories().subscribe({
      next: (response) => this.categories.set(response),
      error: () => this.categories.set([]),
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
    this.selectedBrand.set('');
    this.selectedPrice.set('');
    this.selectedRating.set('');
    this.sortBy.set('featured');
    this.currentPage.set(1);
  }
}
