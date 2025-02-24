import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<any[]>(this.loadCartFromLocalStorage());
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private loadCartFromLocalStorage(): any[] {
    if (this.isLocalStorageAvailable()) {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  }

  private saveCartToLocalStorage(cart: any[]): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }


  getCartItems(): any[] {
    return this.cartSubject.value;
  }


  fetchCartItems(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('token', token || '');

    return this.http.get('https://ecommerce.routemisr.com/api/v1/cart', { headers });
  }


  addToCart(productId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('token', token || '');

    const payload = {
      productId: productId
    };

    return this.http.post('https://ecommerce.routemisr.com/api/v1/cart', payload, { headers }).pipe(
      tap(() => {
        const currentCart = this.cartSubject.value;
        currentCart.push(productId);
        this.cartSubject.next(currentCart);
        this.saveCartToLocalStorage(currentCart);
      })
    );
  }

  removeFromCart(productId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('token', token || '');

    return this.http.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, { headers }).pipe(
      tap(() => {
        const currentCart = this.cartSubject.value.filter(item => item._id !== productId);
        this.cartSubject.next(currentCart);
        this.saveCartToLocalStorage(currentCart);
      })
    );
  }


  clearCart(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('token', token || '');

    return this.http.delete('https://ecommerce.routemisr.com/api/v1/cart', { headers }).pipe(
      tap(() => {
        this.cartSubject.next([]);
        this.saveCartToLocalStorage([]);
      })
    );
  }

  updateQuantity(productId: string, quantity: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('token', token || '');

    const payload = {
      count: quantity
    };

    return this.http.put(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, payload, { headers }).pipe(
      tap(() => {
        const currentCart = this.cartSubject.value.map(item => {
          if (item._id === productId) {
            item.quantity = quantity;
          }
          return item;
        });
        this.cartSubject.next(currentCart);
        this.saveCartToLocalStorage(currentCart);
      })
    );
  }

  // Check if a product is in the cart
  isInCart(productId: string): boolean {
    return this.cartSubject.value.some(item => item._id === productId);
  }
}
