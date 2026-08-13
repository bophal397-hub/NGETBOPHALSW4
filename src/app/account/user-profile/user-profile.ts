import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css'],
})
export class UserProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  readonly user = this.authService.currentUser;
  readonly profileForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: [''],
    avatar: [''],
  });

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    const current = this.user();
    if (current) {
      this.profileForm.patchValue({
        name: current.name,
        phone: current.phone ?? '',
        avatar: current.avatar ?? '',
      });
    }
  }

  submit(): void {
    const current = this.user();
    if (!current) {
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const raw = this.profileForm.getRawValue();
    this.userService.updateUser(current.id, {
      name: raw.name ?? current.name,
      phone: raw.phone ?? current.phone,
      avatar: raw.avatar ?? current.avatar,
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Profile updated successfully.';
        this.authService.currentUser.set(response.data ?? current);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to update profile. Please try again.';
      },
    });
  }
}
