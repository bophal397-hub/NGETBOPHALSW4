import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.HomePageComponent) },
  { path: 'products', loadComponent: () => import('./pages/products/products').then((m) => m.ProductsPageComponent) },
  { path: 'product/:id', loadComponent: () => import('./pages/product-details/product-details').then((m) => m.ProductDetailsPageComponent) },
  { path: 'categories', loadComponent: () => import('./pages/categories/categories').then((m) => m.CategoriesPageComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.AboutPageComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactPageComponent) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart').then((m) => m.CartPageComponent) },
  { path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist').then((m) => m.WishlistPageComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then((m) => m.LoginPageComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then((m) => m.RegisterPageComponent) },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password').then((m) => m.ForgotPasswordPageComponent) },
  { path: 'reset-password', loadComponent: () => import('./pages/reset-password/reset-password').then((m) => m.ResetPasswordPageComponent) },
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/account-layout/account-layout').then((m) => m.AccountLayoutComponent),
    children: [
      { path: 'profile', loadComponent: () => import('./account/user-profile/user-profile').then((m) => m.UserProfileComponent) },
      { path: 'change-password', loadComponent: () => import('./account/change-password/change-password').then((m) => m.ChangePasswordComponent) },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./admin/admin-layout/admin-layout').then((m) => m.AdminLayoutComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('./admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboardComponent) },
      { path: 'products', loadComponent: () => import('./admin/admin-products/admin-products').then((m) => m.AdminProductsComponent) },
      { path: 'products/add', loadComponent: () => import('./admin/admin-product-form/admin-product-form').then((m) => m.AdminProductFormComponent) },
      { path: 'products/edit/:id', loadComponent: () => import('./admin/admin-product-form/admin-product-form').then((m) => m.AdminProductFormComponent) },
      { path: 'users', loadComponent: () => import('./admin/admin-users/admin-users').then((m) => m.AdminUsersComponent) },
      { path: 'users/:id', loadComponent: () => import('./admin/admin-user-details/admin-user-details').then((m) => m.AdminUserDetailsComponent) },
      { path: 'messages', loadComponent: () => import('./admin/admin-messages/admin-messages').then((m) => m.AdminMessagesComponent) },
      { path: 'settings', loadComponent: () => import('./admin/admin-settings/admin-settings').then((m) => m.AdminSettingsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
