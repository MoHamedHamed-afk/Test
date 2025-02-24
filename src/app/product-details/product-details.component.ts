import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  loading: boolean = false;
  errorMessage: string = '';
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authService.authState.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.fetchProductDetails(productId);
    } else {
      this.errorMessage = 'No product ID provided.';
    }
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
    if (!this.isLoggedIn) {
      return false;
    }
    return this.cartService.isInCart(product._id);
  }

  addToWishlist(): void {
    if (!this.authService.isAuthenticated()) {
      this.toastService.show('You must be logged in to add products to the wishlist!');
      return;
    }

    if (this.product) {
      this.wishlistService.addToWishlist(this.product);
      this.toastService.show(`${this.product.title} added to wishlist!`);
    }
  }

  fetchProductDetails(id: string): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (response: any) => {
        this.product = response?.data?.product || null;
        this.product = response?.data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading product details:', err);
        this.errorMessage = err.error?.message || 'Failed to load product details.';
        this.loading = false;
      }
    });
  }
}
