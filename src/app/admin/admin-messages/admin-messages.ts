import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactMessage } from '../../models/contact-message';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-messages.html',
  styleUrls: ['./admin-messages.css'],
})
export class AdminMessagesComponent {
  private readonly messageService = inject(MessageService);

  readonly allMessages = signal<ContactMessage[]>([]);
  readonly loading = signal(true);
  readonly searchTerm = signal('');
  readonly statusFilter = signal<'all' | 'unread' | 'read' | 'replied'>('all');
  readonly selectedMessage = signal<ContactMessage | null>(null);
  readonly replyText = signal('');
  readonly replyingTo = signal<string | null>(null);

  readonly filteredMessages = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    let result = this.allMessages();

    if (status !== 'all') {
      result = result.filter((msg) => msg.status === status);
    }

    if (search) {
      result = result.filter(
        (msg) =>
          msg.name.toLowerCase().includes(search) ||
          msg.email.toLowerCase().includes(search) ||
          msg.subject.toLowerCase().includes(search) ||
          msg.message.toLowerCase().includes(search)
      );
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  readonly unreadCount = computed(() => this.allMessages().filter((msg) => msg.status === 'unread').length);

  constructor() {
    this.loadMessages();
  }

  private loadMessages(): void {
    this.messageService.getMessages().subscribe({
      next: (response) => {
        this.allMessages.set(response.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  openMessage(message: ContactMessage): void {
    this.selectedMessage.set(message);
    if (message.status === 'unread') {
      this.markRead(message);
    }
  }

  closeMessage(): void {
    this.selectedMessage.set(null);
    this.replyText.set('');
    this.replyingTo.set(null);
  }

  startReply(messageId: string): void {
    this.replyingTo.set(messageId);
    this.replyText.set('');
  }

  cancelReply(): void {
    this.replyingTo.set(null);
    this.replyText.set('');
  }

  sendReply(messageId: string): void {
    const reply = this.replyText().trim();
    if (!reply) {
      return;
    }

    const message = this.allMessages().find((m) => m.id === messageId);
    if (!message) {
      return;
    }

    const previousReply = message.reply;
    const previousStatus = message.status;

    message.reply = reply;
    message.status = 'replied';
    message.repliedAt = new Date().toISOString();

    this.messageService.replyToMessage(messageId, reply).subscribe({
      next: (response) => {
        const updated = response.data;
        if (updated) {
          const index = this.allMessages().findIndex((m) => m.id === messageId);
          if (index >= 0) {
            const messages = [...this.allMessages()];
            messages[index] = updated;
            this.allMessages.set(messages);
          }
        }
        this.replyingTo.set(null);
        this.replyText.set('');
      },
      error: () => {
        message.reply = previousReply;
        message.status = previousStatus;
        alert('Unable to send reply.');
      },
    });
  }

  deleteMessage(id: string): void {
    const confirmed = window.confirm('Delete this message?');
    if (!confirmed) {
      return;
    }

    const previousMessages = this.allMessages();
    this.allMessages.set(this.allMessages().filter((message) => message.id !== id));

    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.allMessages.set(this.allMessages().filter((message) => message.id !== id));
      },
      error: () => {
        this.allMessages.set(previousMessages);
        alert('Unable to delete the message.');
      },
    });
  }

  markRead(message: ContactMessage): void {
    if (message.status === 'read' || message.status === 'replied') {
      return;
    }

    const previousStatus = message.status;
    message.status = 'read';

    this.messageService.markAsRead(message.id).subscribe({
      next: (response) => {
        const updated = response.data ?? message;
        const index = this.allMessages().findIndex((item) => item.id === message.id);
        if (index >= 0) {
          const messages = [...this.allMessages()];
          messages[index] = updated;
          this.allMessages.set(messages);
        }
      },
      error: () => {
        message.status = previousStatus;
      },
    });
  }
}
