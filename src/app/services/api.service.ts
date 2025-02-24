import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1'; 

  constructor(private http: HttpClient) { }


  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`);
  }


  getBrands(): Observable<any> {
    return this.http.get(`${this.baseUrl}/brands`);
  }


getProducts(): Observable<any> {
  return this.http.get(`${this.baseUrl}/products`);
}

getProduct(id: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/products/${id}`);
}


  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signin`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signup`, userData);
  }


  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgotPasswords`, { email });
  }


  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders`, orderData, {
      headers: {
        token: localStorage.getItem('token') || '' 
      }
    });
  }

  addToWishlist(productId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/wishlist`, { productId }, {
      headers: {
        token: localStorage.getItem('token') || ''
      }
    });
  }

  getCart(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cart`, {
      headers: {
        token: localStorage.getItem('token') || ''
      }
    });
  }
}