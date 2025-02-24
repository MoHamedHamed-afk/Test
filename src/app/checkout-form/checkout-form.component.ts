import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Ensure ReactiveFormsModule is imported
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css']
})
export class CheckoutFormComponent {
  checkoutForm!: FormGroup; // Use '!' to tell TypeScript it's assigned later

  constructor(private fb: FormBuilder, private router: Router) {
    this.checkoutForm = this.fb.group({
      details: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      city: ['', Validators.required]
    });
  }

  submitForm(): void {
    if (this.checkoutForm.valid) {
      console.log('Form Submitted:', this.checkoutForm.value);
      this.router.navigate(['/payment']); // Redirect to payment after form submission
    }
  }
}
