import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  loading = false;
  errorMessage = '';
  totalPrice = 0;
  totalItems = 0;
  cartDetails: any;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.fetchCartItems().subscribe({
      next: (response: any) => {
        this.cartItems = response.data.products; 
        this.cartDetails = response; 
        this.calculateTotals();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading cart:', err);
        this.errorMessage = 'Failed to load cart.';
        this.loading = false;
      }
    });
  }

  calculateTotals(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.count, 0);
    this.totalItems = this.cartItems.reduce((sum, item) => sum + item.count, 0);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) {
      return;
    }

    this.cartService.updateQuantity(productId, quantity).subscribe({
      next: (response: any) => {
        this.cartItems = response.data.products;
        this.calculateTotals();
      },
      error: (err: any) => {
        console.error('Error updating quantity:', err);
        this.errorMessage = 'Failed to update quantity.';
      }
    });
  }

  onQuantityChange(event: Event, productId: string): void {
    const inputElement = event.target as HTMLInputElement;
    const quantity = parseInt(inputElement.value, 10);
    this.updateQuantity(productId, quantity);
  }

  goToPayment(): void {
    this.router.navigate(['/payment'], { state: { cartDetails: this.cartDetails } });
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err: any) => {
        console.error('Error removing item from cart:', err);
        this.errorMessage = 'Failed to remove item from cart.';
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cartItems = [];
        this.totalPrice = 0; 
        this.totalItems = 0;
      },
      error: (err: any) => {
        console.error('Error clearing cart:', err);
        this.errorMessage = 'Failed to clear cart.';
      }
    });
  }
}
