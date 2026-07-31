import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
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
