import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
})
export class ResetPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly resetForm = this.fb.group({
    token: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: this.matchPasswordValidator,
  });

  submitted = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token') ?? '';
      this.resetForm.patchValue({ token });
    });
  }

  submit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;
    const raw = this.resetForm.getRawValue();
    this.authService.resetPassword({
      token: raw.token ?? '',
      password: raw.password ?? '',
      confirmPassword: raw.confirmPassword ?? '',
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Your password has been reset successfully.';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to reset the password. Please request a new reset link.';
      },
    });
  }

  private matchPasswordValidator(group: ReturnType<FormBuilder['group']>) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
