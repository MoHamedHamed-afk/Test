import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'https://ecommerce.routemisr.com/api/v1/orders';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCartId(): Observable<string | null> {
    const token = this.authService.getToken();
    if (!token) {
      console.error(' User token is missing.');
      return of(null);
    }

    const headers = this.authService.getAuthHeaders();

    return this.http.get<{ data: { _id: string } }>(`https://ecommerce.routemisr.com/api/v1/cart`, { headers }).pipe(
      map(response => {
        console.log(' Cart ID Response:', response); // Testt
        if (response?.data?._id) {
          return response.data._id;
        } else {
          console.warn(' No Cart ID found in response.');
          return null;
        }
      }),
      catchError(error => {
        console.error(' Failed to retrieve cart ID:', error);
        return of(null);
      })
    );
  }

  checkoutSession(cartId: string, orderData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('token', token || '');

    return this.http
      .post(`${this.apiUrl}/checkout-session/${cartId}?url=http://localhost:3000`, orderData, { headers })
      .pipe(
        map(response => {
          console.log('Checkout session created successfully:', response); // Test
          return response;
        }),
        catchError(error => {
          console.error('Error creating checkout session:', error); // Test2
          return of({ error: 'Failed to create checkout session' });
        })
      );
  }
}