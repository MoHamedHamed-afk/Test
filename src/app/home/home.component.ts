import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { WishlistService } from '../services/wishlist.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  randomProducts: any[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';
  currentSlide = 0;
  isLoggedIn = false;

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authService.authState.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });

    this.loadProducts();
    this.loadRandomProducts();
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

  loadRandomProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        const allProducts = this.extractProductsArray(response);
        this.randomProducts = this.getRandomProducts(allProducts, 10); // Get 10 random products
      },
      error: (err: any) => {
        console.error('Error loading random products:', err);
      }
    });
  }

  getRandomProducts(products: any[], count: number): any[] {
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
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

  prevSlide(): void {
    this.currentSlide = (this.currentSlide === 0) ? this.randomProducts.length - 1 : this.currentSlide - 1;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide === this.randomProducts.length - 1) ? 0 : this.currentSlide + 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  get sliderTransform(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
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