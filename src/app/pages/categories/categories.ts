import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryOption, ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
})
export class CategoriesPageComponent {
  private readonly productService = inject(ProductService);
  readonly categories = signal<CategoryOption[]>([]);
  readonly categoryProducts = signal<Record<string, Product[]>>({});

  constructor() {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (response) => {
        const categories = response.slice(0, 8);
        this.categories.set(categories);
        categories.forEach((category) => {
          this.productService.getProductsByCategory(category.slug, 4).subscribe((items) => {
            this.categoryProducts.update((current) => ({ ...current, [category.slug]: items.products }));
          });
        });
      },
    });
  }

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
}
