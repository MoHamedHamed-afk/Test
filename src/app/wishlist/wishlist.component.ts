import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../services/wishlist.service';
import { CartService } from '../services/cart.service';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private toastService: ToastService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.loading = true;
    try {
      this.wishlistItems = this.wishlistService.getWishlistItems();
    } catch (err: any) {
      console.error('Error loading wishlist:', err);
      this.toastService.show('Failed to load wishlist.');
      this.errorMessage = 'Failed to load wishlist.';
    }
    this.loading = false;
  }

  removeItem(productId: string): void {
    this.wishlistService.removeFromWishlist(productId);
    this.wishlistItems = this.wishlistService.getWishlistItems();
    this.toastService.show('Item removed from wishlist!');
  }

  toggleCart(product: any): void {
    if (!this.authService.isAuthenticated()) {
      this.toastService.show('You must be logged in to add products to the cart!');
      return;
    }

    const isInCart = this.cartService.isInCart(product._id);

    if (isInCart) {
      this.cartService.removeFromCart(product._id).subscribe({
        next: () => {
          this.toastService.show(`Removed "${product.title}" from cart!`);
        },
        error: (error) => {
          console.error('Failed to remove product from cart:', error);
          this.toastService.show('Failed to remove product from cart.');
        }
      });
    } else {
      this.cartService.addToCart(product).subscribe({
        next: () => {
          this.toastService.show(`Added "${product.title}" to cart!`);
        },
        error: (error) => {
          console.error('Failed to add product to cart:', error);
          this.toastService.show('Failed to add product to cart.');
        }
      });
    }
  }

  isInCart(product: any): boolean {
    return this.cartService.isInCart(product._id);
  }
}
