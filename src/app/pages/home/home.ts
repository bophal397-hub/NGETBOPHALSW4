import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { CategoryOption, ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomePageComponent {
  private readonly productService = inject(ProductService);
  readonly featuredProducts = signal<Product[]>([]);
  readonly newArrivals = signal<Product[]>([]);
  readonly categories = signal<CategoryOption[]>([]);
  readonly loading = signal(true);
  readonly heroTitle = 'Welcome to SETEC INSTITUTE MARKET';
  readonly heroSubtitle = 'Shop the best products online with unbeatable deals, trusted brands, and fast delivery.';

  readonly featuredProductsList = computed(() => this.featuredProducts().slice(0, 8));
  readonly newArrivalsList = computed(() => this.newArrivals().slice(0, 8));

  getCategoryImage(categorySlug: string): string {
    const imageMap: Record<string, string> = {
      beauty: '/Beauty.jpg',
      fragrances: '/Fragrance.jpg',
      furniture: '/Furniture.jpg',
      groceries: '/groceries.jpg',
      'home-decoration': '/HomeDecoration.jpg',
      'kitchen-accessories': '/KitchenAccessories.jpg',
      laptops: '/laptop.jpg',
      'mens-shirts': '/MenShirt.jpg',
    };

    return imageMap[categorySlug] || '/LOGO-SETEC.ico';
  }

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.productService.getProducts(24).subscribe({
      next: (response) => {
        this.featuredProducts.set(response.products.slice(0, 8));
        this.newArrivals.set(response.products.slice(8, 16));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });

    this.productService.getCategories().subscribe({
      next: (response) => this.categories.set(response.slice(0, 8)),
      error: () => this.categories.set([]),
    });
  }
}
