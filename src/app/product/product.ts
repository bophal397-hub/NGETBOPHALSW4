import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrls: ['./product.css'],
})
export class Product {
  searchText: string = '';
  selectedCategory: string = '';
  price: number = 0;
  quantity: number = 0;
  isEditMode: boolean = false;
  editingProduct: any = null;
  editingProductCopy: any = null;
  deleteModalOpen: boolean = false;
  deleteCandidate: any = null;
  statusMessage: string = '';
  statusType: 'success' | 'error' | '' = '';

  product = [
    {
      productID: 1001,
      productName: 'Laptop',
      price: 800.0,
      quantity: 2,
      createDate: new Date(),
      category: 'Electronics',
      Image: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/dell-pro-max-premium/ma16250/media-gallery/notebook-pro-max-ma16250nt-bk-fpr-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&wid=4314&hei=3223&qlt=100,1&resMode=sharp2&size=4314,3223&chrss=full&imwidth=5000https://www.dell.com/en-us/shop/dell-laptops/sr/laptops',
      description: 'A high-performance laptop',
      subcategory: 'Computers',
    },
    {
      productID: 1002,
      productName: 'Smartphone',
      price: 500.0,
      quantity: 3,
      createDate: new Date(),
      category: 'Electronics',
      Image: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s26-ultra-1.jpg',
      description: 'A latest smartphone',
      subcategory: 'Mobile Phones',
    },
    {
      productID: 1003,
      productName: 'Headphones',
      price: 150.0,
      quantity: 4,
      createDate: new Date(),
      category: 'Electronics',
      Image: 'https://m.media-amazon.com/images/I/61drDn6HJRL._AC_SX466_.jpg',
      description: 'Noise-cancelling headphones',
      subcategory: 'Audio',
    },
    {
      productID: 1004,
      productName: 'Dell 16 Plus',
      price: 300.0,
      quantity: 2,
      createDate: new Date(),
      category: 'Electronics',
      Image: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/dell-plus/db16250/notebook-db16250nt-copilot-pc-mg.png?fmt=png-alpha&pscan=auto&scl=1&wid=2048&hei=1397&qlt=100,1&resMode=sharp2&size=2048,1397&chrss=full&imwidth=5000',
      description: 'A sleek tablet',
      subcategory: 'Computers',
    },
    {
      productID: 1005,
      productName: 'Alienware 16 Aurora Gaming Laptop',
      price: 1408.0,
      quantity: 1,
      createDate: new Date(),
      category: 'Electronics',
      Image: 'https://i.dell.com/is/image/DellContent/content/dam/images/products/laptops-and-2-in-1s/alienware/ac16250-non-touch/alienware-ac16250-laptop-c-15000ff105-bl.psd?$S7-480wide$&layer=1&perspective=892,566,4102,566,4102,2588,898,2600&pos=-326,-459&src=is%7BDellContent/alienware-brand-wallpaper-screenfill-dreamscape-fhd-1920x1080?size=4000,4000%7D',
      description: 'A latest gaming laptop',
      subcategory: 'Computers',
    },
    {
      productID: 1006,
      productName: 'Bluetooth Headphones',
      price: 19.0,
      quantity: 2,
      createDate: new Date(),
      category: 'Electronics',
      Image: 'https://m.media-amazon.com/images/I/71F2ccIPPLL._AC_SX466_.jpg',
      description: 'A latest Bluetooth Headphones',
      subcategory: 'Audio',
    },
  ];

  get subcategories() {
    return Array.from(new Set(this.product.map((p) => p.subcategory))).sort();
  }

  get categories() {
    return Array.from(new Set(this.product.map((p) => p.category))).sort();
  }

  get filteredProducts() {
    return this.product.filter((p) => {
      const searchLower = this.searchText.trim().toLowerCase();
      const matchesSearch =
        searchLower === '' ||
        p.productID.toString().includes(searchLower) ||
        p.productName.toLowerCase().includes(searchLower);
      const matchesCategory = this.selectedCategory === '' || p.subcategory === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  // create a function to edit product and save the changes to the product list

  editProduct(product: any) {
    this.editingProduct = product;
    this.editingProductCopy = { ...product };
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editingProduct = null;
    this.editingProductCopy = null;
  }

  saveEdit() {
    if (this.editingProductCopy) {
      const index = this.product.findIndex((p) => p.productID === this.editingProductCopy.productID);
      if (index !== -1) {
        this.product[index] = { ...this.editingProductCopy };
        alert('Product updated successfully!');
      }
    }
    this.cancelEdit();
  }

  deleteProduct(product: any) {
    this.deleteCandidate = product;
    this.deleteModalOpen = true;
  }

  confirmDelete() {
    if (!this.deleteCandidate) {
      return;
    }

    const index = this.product.findIndex((p) => p.productID === this.deleteCandidate.productID);
    if (index !== -1) {
      const deletedName = this.deleteCandidate.productName;
      this.product.splice(index, 1);
      alert(`${deletedName} has been deleted.`);
      this.setStatus(`${deletedName} has been deleted.`, 'success');
    }
    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.deleteModalOpen = false;
    this.deleteCandidate = null;
  }

  private setStatus(message: string, type: 'success' | 'error' = 'success') {
    this.statusMessage = message;
    this.statusType = type;

    setTimeout(() => {
      this.statusMessage = '';
      this.statusType = '';
    }, 3500);
  }
}
