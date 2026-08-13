import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submitted = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  submit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.forgotForm.invalid) {
      return;
    }

    this.loading = true;
    const email = this.forgotForm.get('email')?.value ?? '';
    this.authService.forgotPassword({ email }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'If an account exists, a reset link has been prepared for this email.';
        this.forgotForm.reset();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to process your request right now. Please try again later.';
      },
    });
  }
}
