import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css'],
})
export class Auth {
  login = {
    email: '',
    password: '',
  };

  register = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  loginMessage = '';
  registerMessage = '';

  onLoginSubmit(): void {
    if (!this.login.email || !this.login.password) {
      this.loginMessage = 'Please fill in both email and password.';
      return;
    }

    this.loginMessage = `Welcome back, ${this.login.email}!`;
  }

  onRegisterSubmit(): void {
    if (!this.register.name || !this.register.email || !this.register.password) {
      this.registerMessage = 'Please complete all required fields.';
      return;
    }

    if (this.register.password !== this.register.confirmPassword) {
      this.registerMessage = 'Passwords do not match.';
      return;
    }

    this.registerMessage = `Account created for ${this.register.name}.`;
  }
}
