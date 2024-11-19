import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {OrderService} from '../services/order.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


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

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  isAdmin: boolean = false;

  constructor(private orderService: OrderService,private router: Router) {
    this.checkAdminRole();
  }

  checkAdminRole(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.isAdmin = decodedToken.role === 'admin';
      } catch (error) {
        console.error('Error decoding token:', error);
        this.isAdmin = false;
      }
    }
  }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.errorMessage = 'Failed to load orders. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  updateOrder(orderId: number): void {
    this.router.navigate(['/edit-order/' + orderId]);
  }
}
