import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-user-details.html',
  styleUrls: ['./admin-user-details.css'],
})
export class AdminUserDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

  user: User | null = null;
  loading = true;

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadUser(id);
      }
    });
  }

  private loadUser(id: string): void {
    this.userService.getUser(id).subscribe({
      next: (response) => {
        this.user = response.data ?? null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
