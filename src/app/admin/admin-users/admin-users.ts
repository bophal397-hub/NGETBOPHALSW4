import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css'],
})
export class AdminUsersComponent {
  private readonly userService = inject(UserService);

  users: User[] = [];
  loading = true;

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  toggleStatus(user: User): void {
    const action = user.isActive ? this.userService.deactivateUser(user.id) : this.userService.activateUser(user.id);
    action.subscribe({
      next: () => {
        user.isActive = !user.isActive;
      },
      error: () => {
        alert('Unable to update user status.');
      },
    });
  }

  resetPassword(userId: string): void {
    const confirmed = window.confirm('Reset password for this user?');
    if (!confirmed) {
      return;
    }

    this.userService.resetUserPassword(userId).subscribe({
      next: () => {
        alert('Password reset request processed.');
      },
      error: () => {
        alert('Unable to reset the password.');
      },
    });
  }
}
