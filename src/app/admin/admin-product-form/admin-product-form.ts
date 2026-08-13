import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductInput, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-product-form.html',
  styleUrls: ['./admin-product-form.css'],
})
export class AdminProductFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  readonly categoryOptions = signal<string[]>([]);

  readonly form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    brand: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    discountPercentage: [0, [Validators.min(0), Validators.max(100)]],
    rating: [0, [Validators.min(0), Validators.max(5)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    thumbnail: ['', Validators.required],
    images: this.fb.control<string[]>([]),
  });

  isEditMode = false;
  productId: number | null = null;
  loading = false;
  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.loadCategories();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = Number(id);
        this.loadProduct(this.productId);
      }
    });
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        const names = categories.map((category) => category.name || category.slug);
        this.categoryOptions.set(names);
      },
      error: () => {
        this.categoryOptions.set([
          'Electronics',
          'Furniture',
          'Home Decor',
          'Clothing',
          'Accessories',
          'Beauty',
          'Groceries',
        ]);
      },
    });
  }

  private loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.loading = false;
        this.form.patchValue({
          title: product.title,
          description: product.description,
          category: product.category,
          brand: product.brand,
          price: product.price,
          discountPercentage: product.discountPercentage,
          rating: product.rating,
          stock: product.stock,
          thumbnail: product.thumbnail,
          images: Array.isArray(product.images) ? product.images : ([] as string[]),
        });
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load the product.';
      },
    });
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: ProductInput = {
      title: this.form.get('title')?.value ?? '',
      description: this.form.get('description')?.value ?? '',
      category: this.form.get('category')?.value ?? '',
      brand: this.form.get('brand')?.value ?? '',
      price: this.form.get('price')?.value ?? 0,
      discountPercentage: this.form.get('discountPercentage')?.value ?? 0,
      rating: this.form.get('rating')?.value ?? 0,
      stock: this.form.get('stock')?.value ?? 0,
      thumbnail: this.form.get('thumbnail')?.value ?? '',
      images: (this.form.get('images')?.value as string[] | null) ?? [],
    };

    const request = this.isEditMode && this.productId !== null
      ? this.productService.updateProduct(this.productId, payload)
      : this.productService.addProduct(payload);

    request.subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = this.isEditMode ? 'Product updated successfully.' : 'Product added successfully.';
        this.router.navigate(['/admin/products']);
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'There was a problem saving the product.';
      },
    });
  }
}
