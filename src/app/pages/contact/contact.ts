import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class ContactPageComponent {
  readonly contactForm: FormGroup;
  submitted = false;

  constructor(private readonly fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.contactForm.valid) {
      alert('Thanks for your message! We will get back to you shortly.');
      this.contactForm.reset();
      this.submitted = false;
    }
  }
}
