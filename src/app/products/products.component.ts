import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { WishlistService } from '../services/wishlist.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';
  isLoggedIn = false;

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toastService: ToastService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authService.authState.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if (!loggedIn) {
        this.resetCartState();
      }
    });

    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        this.products = this.extractProductsArray(response);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
        this.errorMessage = err.error?.message || 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.loadProducts();
      return;
    }
    this.loading = true;
    this.productService.searchProducts(this.searchTerm).subscribe({
      next: (response: any) => {
        this.products = this.extractProductsArray(response);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error searching products:', err);
        this.errorMessage = err.error?.message || 'Search failed.';
        this.products = [];
        this.loading = false;
      }
    });
  }

  toggleWishlist(product: any): void {
    if (!this.authService.isAuthenticated()) {
      this.toastService.show('You must be logged in to manage your wishlist!');
      return;
    }

    const isInList = this.wishlistService
      .getWishlistItems()
      .some((item: any) => item._id === product._id);

    if (isInList) {
      this.wishlistService.removeFromWishlist(product._id);
      this.toastService.show(`Removed "${product.title}" from wishlist!`);
    } else {
      this.wishlistService.addToWishlist(product);
      this.toastService.show(`Added "${product.title}" to wishlist!`);
    }
  }

  isInWishlist(product: any): boolean {
    if (!this.isLoggedIn) {
      return false;
    }
    return this.wishlistService
      .getWishlistItems()
      .some((item: any) => item._id === product._id);
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

  private resetCartState(): void {
    //reset cart state when the user logs out
  }

  private extractProductsArray(response: any): any[] {
    if (Array.isArray(response)) return response;
    if (response?.data?.products && Array.isArray(response.data.products)) {
      return response.data.products;
    }
    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }
}
