import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Product } from './product/product';
import { Category } from './category/category';
import { About } from './about/about';
import { Home } from './home/home';
import { Contact } from './contact/contact'; 
import { ListProduct } from './list-product/list-product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, Product, Category, About, Home, Contact,ListProduct,RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('ANGULARSW4');
  //DECLARE VARIABLES USING TYPESCRIPT
  studentid: number = 123456;
  studentname: string = "NGET BOPHAL";
  subject: string = "Web Development III";
  dob: Date = new Date("2005-05-26"); // May 26, 2005'
  productID: number = 1001;
  productName: string = "Laptop";
  productPrice: number = 800.00;
  Quantity: number = 2;
  Amount: number = this.productPrice * this.Quantity;
  CreateDDate: Date = new Date();
  category: string = "Electronics";
  Subcategory: string = "Computers";
}
