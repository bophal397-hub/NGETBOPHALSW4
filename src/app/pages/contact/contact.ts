import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class ContactPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);

  readonly contactForm: FormGroup;
  readonly submitted = signal(false);
  readonly submitting = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
    });
  }

  submit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
    this.submitted.set(true);

    if (!this.contactForm.valid) {
      return;
    }

    this.submitting.set(true);

    const payload = {
      name: this.contactForm.get('name')?.value ?? '',
      email: this.contactForm.get('email')?.value ?? '',
      subject: this.contactForm.get('subject')?.value ?? '',
      message: this.contactForm.get('message')?.value ?? '',
    };

    this.messageService.sendMessage(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.successMessage.set('Thanks for your message! We will get back to you shortly.');
        this.contactForm.reset();
        this.submitted.set(false);
        setTimeout(() => this.successMessage.set(''), 5000);
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('Unable to send your message. Please try again later.');
      },
    });
  }
}
