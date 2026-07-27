import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../service/product';
import { Product } from '../service/product.model';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './list-product.html',
  styleUrls: ['./list-product.css'],
})
export class ListProduct implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  errorMessage = '';
  isLoading = true;
  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.products.length / 20);
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * 20;
    return this.products.slice(startIndex, startIndex + 20);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  goToFirst() {
    this.goToPage(1);
  }

  goToLast() {
    if (this.totalPages > 0) {
      this.goToPage(this.totalPages);
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (data) => {
        const productList = data?.products;
        this.products = Array.isArray(productList) ? productList : [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Product load error:', error);
        this.products = [];
        this.errorMessage = 'Failed to load products. Verify the API URL and network connection.';
        this.isLoading = false;
      },
    });
  }

  editProduct(product: Product) {
    this.selectedProduct = { ...product };
  }

  saveProduct() {
    if (!this.selectedProduct) {
      return;
    }

    const index = this.products.findIndex((p) => p.id === this.selectedProduct!.id);
    if (index !== -1) {
      this.products[index] = { ...this.selectedProduct };
      this.selectedProduct = null;
    }
  }

  cancelEdit() {
    this.selectedProduct = null;
  }

  deleteProduct(product: Product) {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.products.splice(index, 1);
      if (this.selectedProduct?.id === product.id) {
        this.selectedProduct = null;
      }
    }
  }
}