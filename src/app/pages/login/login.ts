import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  submitted = false;
  loading = false;
  errorMessage = '';

  submit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const raw = this.loginForm.getRawValue();
    const email = raw.email ?? '';
    const password = raw.password ?? '';
    const rememberMe = !!raw.rememberMe;

    this.authService
      .login({ email, password, rememberMe })
      .subscribe({
        next: () => {
          this.loading = false;
          const destination = this.authService.isAdmin() ? ['/admin'] : ['/account/profile'];
          this.router.navigate(destination);
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Invalid email or password. Please try again.';
        },
      });
  }
}
