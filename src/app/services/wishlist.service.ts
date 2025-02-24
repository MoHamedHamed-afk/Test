import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: any[] = [];

  constructor() {}

  getWishlistItems(): any[] {
    return this.wishlistItems;
  }

  addToWishlist(product: any): void {
    const exists = this.wishlistItems.find((item: any) => item._id === product._id);
    if (!exists) {
      this.wishlistItems.push(product);
    }
  }

  removeFromWishlist(productId: string): void {
    this.wishlistItems = this.wishlistItems.filter((item: any) => item._id !== productId);
  }
}
