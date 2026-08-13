import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: this.matchPasswordValidator,
  });

  submitted = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  submit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    const raw = this.registerForm.getRawValue();
    const name = raw.name ?? '';
    const email = raw.email ?? '';
    const phone = raw.phone ?? '';
    const password = raw.password ?? '';
    const confirmPassword = raw.confirmPassword ?? '';

    this.loading = true;
    this.authService
      .register({
        name,
        email,
        phone,
        password,
        confirmPassword,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Account created successfully. Redirecting to login...';
          this.registerForm.reset();
          setTimeout(() => this.router.navigate(['/login']), 1200);
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Unable to create your account. Please try again.';
        },
      });
  }

  private matchPasswordValidator(group: ReturnType<FormBuilder['group']>) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
