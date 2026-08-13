import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css'],
})
export class ChangePasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: this.passwordMatchValidator,
  });

  submitted = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  submit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.authService.changePassword(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Password updated successfully.';
        this.form.reset();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to change your password. Please check your current password and try again.';
      },
    });
  }

  private passwordMatchValidator(group: ReturnType<FormBuilder['group']>) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }
}
