import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

interface OrderLine {
  id: number;
  orderId: number;
  sku: string;
  qty: number;
  desc: string;
}

interface Order {
  id: number;
  orderRef: string;
  orderDate: string;
  currency: string;
  shipDate: string;
  categoryCode: string;
  lines: OrderLine[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    // Check if we're in the browser environment before using localStorage
    const token = this.isBrowser() ? localStorage.getItem('authToken') : null;

    if (token) {
      // Set the Authorization header with the token
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      // Make the request with the token and specify the response type as Order[]
      return this.http.get<Order[]>(this.apiUrl + 'orders', { headers });
    } else {
      // Handle the case where the token is not available (redirect to login or show an error)
      console.error('No token found, please log in');
      return new Observable<Order[]>(); // Return an empty observable or handle the error as needed
    }
  }

  // Utility function to check if the code is running in the browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
