import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should update the local product cache immediately when a product is edited', () => {
    const existingProduct = {
      id: 1,
      title: 'Old title',
      description: 'Old description',
      price: 10,
      discountPercentage: 5,
      rating: 4.5,
      stock: 10,
      brand: 'Brand',
      category: 'Electronics',
      thumbnail: 'https://example.com/thumb.jpg',
      images: ['https://example.com/1.jpg'],
    };

    (service as any).productsCache = [existingProduct];

    let response: any;
    service.updateProduct(1, { title: 'Updated title' }).subscribe((product) => {
      response = product;
    });

    expect((service as any).productsCache[0].title).toBe('Updated title');

    const request = httpMock.expectOne('https://dummyjson.com/products/1');
    expect(request.request.method).toBe('PUT');

    request.flush({
      ...existingProduct,
      title: 'Updated title',
    });

    expect(response.title).toBe('Updated title');
  });
});
