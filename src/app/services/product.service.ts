import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Product } from '../models/product';

export type ProductInput = Omit<Product, 'id'> & { id?: number };

interface ProductApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoryOption {
  slug: string;
  name: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = 'https://dummyjson.com/products';
  private productsCache: Product[] | null = null;
  private categoriesCache: CategoryOption[] | null = null;

  constructor(private readonly http: HttpClient) {}

  getProducts(limit = 100): Observable<ProductApiResponse> {
    if (this.productsCache && this.productsCache.length) {
      const slice = this.productsCache.slice(0, limit);
      return of({ products: slice, total: this.productsCache.length, skip: 0, limit: slice.length });
    }

    return this.http.get<ProductApiResponse>(`${this.baseUrl}?limit=${limit}`).pipe(
      tap((response) => {
        this.productsCache = response.products;
      })
    );
  }

  getProduct(id: number | string): Observable<Product> {
    const cachedProduct = this.productsCache?.find((product) => String(product.id) === String(id));
    if (cachedProduct) {
      return of(cachedProduct);
    }

    return this.http.get<Product>(`${this.baseUrl}/${id}`).pipe(
      tap((product) => {
        if (!this.productsCache) {
          this.productsCache = [];
        }

        const index = this.productsCache.findIndex((item) => String(item.id) === String(product.id));
        if (index >= 0) {
          this.productsCache[index] = product;
        } else {
          this.productsCache.push(product);
        }
      })
    );
  }

  searchProducts(query: string): Observable<ProductApiResponse> {
    return this.http.get<ProductApiResponse>(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
  }

  getCategories(): Observable<CategoryOption[]> {
    if (this.categoriesCache) {
      return of(this.categoriesCache);
    }

    return this.http.get<Array<string | CategoryOption>>(`${this.baseUrl}/categories`).pipe(
      map((response) =>
        response
          .map((item) => {
            if (typeof item === 'string') {
              const slug = item.trim().toLowerCase();
              return {
                slug,
                name: slug.charAt(0).toUpperCase() + slug.slice(1),
                url: `${this.baseUrl}/category/${encodeURIComponent(slug)}`,
              };
            }

            const slug = item.slug?.trim() || item.name?.toLowerCase().replace(/\s+/g, '-').trim() || '';
            return {
              slug,
              name: item.name || slug.charAt(0).toUpperCase() + slug.slice(1),
              url: item.url || `${this.baseUrl}/category/${encodeURIComponent(slug)}`,
            };
          })
          .filter((item) => item.slug)
      ),
      tap((categories) => {
        this.categoriesCache = categories;
      })
    );
  }

  getProductsByCategory(category: string | CategoryOption, limit = 24): Observable<ProductApiResponse> {
    const categorySlug = typeof category === 'string' ? category : category.slug;
    return this.http.get<ProductApiResponse>(`${this.baseUrl}/category/${encodeURIComponent(categorySlug)}?limit=${limit}`);
  }

  addProduct(product: ProductInput): Observable<Product> {
    const optimisticProduct: Product = {
      ...(product as Product),
      id: product.id ?? Date.now(),
    };

    const previousCache = this.productsCache ? [...this.productsCache] : null;
    this.productsCache = this.productsCache ? [optimisticProduct, ...this.productsCache] : [optimisticProduct];

    return this.http.post<Product>(`${this.baseUrl}/add`, product).pipe(
      tap((serverProduct) => {
        this.productsCache = this.productsCache?.map((item) =>
          String(item.id) === String(optimisticProduct.id) ? { ...item, ...serverProduct } : item
        ) ?? [serverProduct];
      }),
      catchError((error) => {
        this.productsCache = previousCache;
        return throwError(() => error);
      })
    );
  }

  updateProduct(id: number | string, product: Partial<ProductInput>): Observable<Product> {
    const previousCache = this.productsCache ? [...this.productsCache] : null;
    const normalizedId = String(id);

    this.productsCache = this.productsCache?.map((item) =>
      String(item.id) === normalizedId ? { ...item, ...product } : item
    ) ?? this.productsCache;

    return this.http.put<Product>(`${this.baseUrl}/${id}`, product).pipe(
      tap((serverProduct) => {
        this.productsCache = this.productsCache?.map((item) =>
          String(item.id) === normalizedId ? { ...item, ...serverProduct } : item
        ) ?? [serverProduct];
      }),
      catchError((error) => {
        this.productsCache = previousCache;
        return throwError(() => error);
      })
    );
  }

  deleteProduct(id: number | string): Observable<{ isDeleted: boolean; id: number | string }> {
    const previousCache = this.productsCache ? [...this.productsCache] : null;
    this.productsCache = this.productsCache?.filter((item) => String(item.id) !== String(id)) ?? [];

    return this.http.delete<{ isDeleted: boolean; id: number | string }>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.productsCache = this.productsCache?.filter((item) => String(item.id) !== String(id)) ?? [];
      }),
      catchError((error) => {
        this.productsCache = previousCache;
        return throwError(() => error);
      })
    );
  }
}
