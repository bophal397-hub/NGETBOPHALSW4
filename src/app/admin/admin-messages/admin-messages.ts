import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ContactMessage } from '../../models/contact-message';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-messages.html',
  styleUrls: ['./admin-messages.css'],
})
export class AdminMessagesComponent {
  private readonly messageService = inject(MessageService);

  messages: ContactMessage[] = [];
  loading = true;

  constructor() {
    this.loadMessages();
  }

  private loadMessages(): void {
    this.messageService.getMessages().subscribe({
      next: (response) => {
        this.messages = response.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  deleteMessage(id: string): void {
    const confirmed = window.confirm('Delete this message?');
    if (!confirmed) {
      return;
    }

    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.messages = this.messages.filter((message) => message.id !== id);
      },
      error: () => {
        alert('Unable to delete the message.');
      },
    });
  }

  markRead(message: ContactMessage): void {
    if (message.status === 'read' || message.status === 'replied') {
      return;
    }

    this.messageService.markAsRead(message.id).subscribe({
      next: (response) => {
        const updated = response.data ?? message;
        const index = this.messages.findIndex((item) => item.id === message.id);
        if (index >= 0) {
          this.messages[index] = updated;
        }
      },
    });
  }
}
