import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class Contact implements OnInit {

  contact = {
    fullname: '',
    email: '',
    phone: '',
    message: ''
  };
  contacts: any[] = [];
  submitted = false;
  submitSuccess = false;
  editIndex = -1;

  ngOnInit() {
    const savedContacts = localStorage.getItem('contact_app_contacts');
    if (savedContacts) {
      try {
        this.contacts = JSON.parse(savedContacts);
      } catch {
        this.contacts = [];
      }
    }
  }

  saveContacts() {
    localStorage.setItem('contact_app_contacts', JSON.stringify(this.contacts));
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      if (this.editIndex === -1) {
        this.contacts.push({
          ...this.contact
        });
      } else {
        this.contacts[this.editIndex] = {
          ...this.contact
        };
        this.editIndex = -1;
      }
      this.saveContacts();
      this.submitSuccess = true;
      this.contact = {
        fullname: '',
        email: '',
        phone: '',
        message: ''
      };
      alert('Contact saved successfully!');
      form.resetForm();
      this.submitted = false;
    } else {
      this.submitSuccess = false;
    }
  }
  editContact(index: number) {
    this.contact = {
      ...this.contacts[index]
    };
    this.editIndex = index;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  deleteContact(index: number) {
    const confirmed = confirm('Are you sure you want to delete this Contact?');
    if (!confirmed) {
      return;
    }

    this.contacts.splice(index, 1);
    this.saveContacts();
    if (this.editIndex === index) {
      this.editIndex = -1;
      this.contact = {
        fullname: '',
        email: '',
        phone: '',
        message: ''
      };
    }
  }
}