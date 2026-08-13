import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboardComponent {
  summary = [
    { label: 'Total Products', value: '120', icon: 'bi-box-seam', tone: 'success' },
    { label: 'Total Users', value: '36', icon: 'bi-people', tone: 'primary' },
    { label: 'Active Users', value: '29', icon: 'bi-person-check', tone: 'warning' },
    { label: 'Unread Messages', value: '7', icon: 'bi-chat-left-text', tone: 'danger' },
  ];

  recentUsers = [
    { name: 'Alice Johnson', email: 'alice@example.com', role: 'user' },
    { name: 'David Kim', email: 'david@example.com', role: 'admin' },
  ];

  recentProducts = [
    { title: 'Premium Wireless Headset', category: 'Electronics' },
    { title: 'Modern Accent Chair', category: 'Furniture' },
  ];

  recentMessages = [
    { name: 'Sarah Lopez', subject: 'Order issue', status: 'unread' },
    { name: 'Michael Chen', subject: 'Product enquiry', status: 'read' },
  ];
}
