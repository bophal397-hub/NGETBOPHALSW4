import {} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Component,ChangeDetectionStrategy,signal,viewChild,TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import { MatDialog,MatDialogModule } from '@angular/material/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tailwind',
  standalone: true,
  styleUrl: './tailwind.css',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,FormsModule, MatDividerModule, CommonModule, MatDialogModule],
  templateUrl: './tailwind.html'
})
export class Tailwind {
    hide = signal(true);
    password = signal('');
    amount = signal(0);
   @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
   constructor(private dialog: MatDialog) {}
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  openDialog() {
    this.dialog.open(this.dialogTemplate, {
      width: '400px',
      height: '300px',
    });
  }
  amountChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseFloat(inputElement.value);
    this.amount.set(isNaN(value) ? 0 : value);
  }
  amountTocurrency() {
    return this.amount().toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
} 
