import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {OrderService} from '../services/order.service';

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

  constructor(private orderService: OrderService) {}

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
}
