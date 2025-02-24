import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../services/payment.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  cartId: string | null = null;
  errorMessage: string = '';
  loading: boolean = false;
  cartDetails: any;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private http: HttpClient,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.cartDetails = navigation?.extras.state?.['cartDetails'];
  }

  ngOnInit(): void {
    if (!this.cartDetails) {
      this.router.navigate(['/cart']);
    }

    this.paymentForm = this.fb.group({
      details: ['', Validators.required],
      phone: ['', [Validators.required]],
      city: ['', Validators.required],
    });

    this.cartId = this.cartDetails?.cartId;
  }

  proceedToCheckout() {
    if (!this.cartId) {
      this.errorMessage = 'Cart ID is required to proceed.';
      return;
    }

    if (this.paymentForm.invalid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      return;
    }

    this.loading = true;

    const orderData = {
      shippingAddress: this.paymentForm.value
    };

    this.paymentService.checkoutSession(this.cartId, orderData).subscribe({
      next: (response) => {
        console.log('Order placed successfully:', response);
        this.loading = false;
        if (response.status === 'success' && response.session?.url) {
          window.location.href = response.session.url;
        } else {
          this.errorMessage = 'Failed to create checkout session. Please try again.';
        }
      },
      error: (error) => {
        console.error('Order submission failed:', error);
        this.errorMessage = 'Order submission failed. Please try again.';
        this.loading = false;
      },
    });
  }
}
