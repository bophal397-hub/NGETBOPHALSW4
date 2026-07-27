import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.html',
  styleUrls: ['./category.css'],
})
export class Category {
  categories = [
    {
      title: 'Computers',
      description: 'Laptops, desktops, and productivity accessories for work and play.',
      count: 12,
      color: '#5f7cff',
    },
    {
      title: 'Mobile Phones',
      description: 'Latest smartphones, cases, and mobile accessories.',
      count: 9,
      color: '#6d28d9',
    },
    {
      title: 'Audio',
      description: 'Headphones, speakers, and sound gear for every listener.',
      count: 7,
      color: '#0f766e',
    },
  ];

  get totalCount() {
    return this.categories.reduce((sum, category) => sum + category.count, 0);
  }
}

