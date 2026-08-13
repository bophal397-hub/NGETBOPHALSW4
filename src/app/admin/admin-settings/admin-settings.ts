import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-settings.html',
  styleUrls: ['./admin-settings.css'],
})
export class AdminSettingsComponent {
  sections = [
    {
      title: 'Store Preferences',
      description: 'Default currency, tax handling, and storefront visibility.',
      value: 'Live',
      tone: 'success',
    },
    {
      title: 'Customer Experience',
      description: 'Account recovery, cart reminders, and welcome messages.',
      value: 'Configured',
      tone: 'primary',
    },
    {
      title: 'Security',
      description: 'Password strength, session checks, and admin access control.',
      value: 'Strong',
      tone: 'warning',
    },
  ];

  toggles = [
    { label: 'Auto email follow-ups', enabled: true },
    { label: 'Low-stock alerts', enabled: true },
    { label: 'New order notifications', enabled: true },
    { label: 'Guest checkout suggestions', enabled: false },
  ];
}
