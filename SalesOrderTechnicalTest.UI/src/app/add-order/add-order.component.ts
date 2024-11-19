import {Component, OnInit} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Order,NewOrder, NewOrderLine, OrderLine, OrderService} from '../services/order.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-add-order',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.css'
})
export class AddOrderComponent implements OnInit{
  order: NewOrder | Order = {
    id:0,
    orderRef: '',
    orderDate: '',
    currency: '',
    shipDate: '',
    categoryCode: '',
    lines: [],
  };

  newLine: NewOrderLine = { sku: '', qty: 0, desc: '' };

  errorMessage: string | null = null; // Holds error messages
  successMessage: string | null = null; // Holds success messages
  isEditMode: boolean = false;
  loading: boolean = true;

  orderDate: string | undefined;  // To store the current date for Order Date field
  currentDate: string | undefined;  // To store the current date and time for Ship Date field

  constructor(private route: ActivatedRoute, private router: Router,private orderService: OrderService) { }

  ngOnInit(): void {
    // Set orderDate to the current date in 'YYYY-MM-DD' format
    this.orderDate = new Date().toISOString().split('T')[0];
    this.currentDate = this.getCurrentDate();  // Extract only the date part (YYYY-MM-DD)

    // Set the shipDate to currentDate (current date without time)
    this.order.shipDate = this.currentDate;

    // Check if an `id` parameter exists
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.isEditMode = true;
      this.loadOrder(orderId);
    } else {
      this.order.shipDate = this.currentDate;
      this.order.orderDate = this.currentDate;
      this.loading = false;
    }
  }

  loadOrder(id: string): void {
    this.orderService.getOrderById(id).subscribe({
      next: (data) => {
        this.order = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching order:', err);
        this.errorMessage = 'Failed to load order details.';
        this.loading = false;
      },
    });
  }

  onShipDateChange(): void {
    // Update the maxOrderDate whenever the shipDate is changed
    const shipDate = new Date(this.order.shipDate);
    shipDate.setDate(shipDate.getDate() + 1);  // Make sure Order Date is not later than Ship Date
    this.currentDate = shipDate.toISOString().split('T')[0];  // Set max date for Order Date (YYYY-MM-DD)
  }

  addLine() {
    // Ensure `order` is of type `Order`
    if (this.order && 'id' in this.order) {
      // Temporarily assign `id` and `orderId` when adding a new line
      const newLine: OrderLine = {
        ...this.newLine,
        id: 0, // New order line will have id 0 until assigned by backend
        orderId: this.order.id || 0, // If orderId is available, use it, otherwise set as 0
      };

      this.order.lines.push(newLine);
      this.newLine = { sku: '', qty: 0, desc: '' }; // Reset input fields
    } else {
      console.error('Order ID is missing.');
    }
  }


  removeOrderLine(index: number) {
    this.order.lines.splice(index, 1);
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.isEditMode && (this.order as Order).id) {
        // Update existing order
        this.orderService.updateOrder(this.order as Order).subscribe({
          next: (response) => {
            this.successMessage = 'Order updated successfully!';
            setTimeout(() => (this.successMessage = null), 3000);
            this.router.navigate(['/orders']); // Redirect to orders page
          },
          error: (err) => {
            console.error('Error updating order:', err);
            this.errorMessage = 'Failed to update order. Please try again.';
          },
        });
      } else {
        // Add new order
        this.orderService.addOrder(this.order as NewOrder).subscribe({
          next: (response) => {
            this.successMessage = 'Order submitted successfully!';
            form.resetForm();
            this.router.navigate(['/orders']);
          },
          error: (err) => {
            console.error('Error submitting order:', err);
            this.errorMessage = 'Failed to submit order. Please try again.';
          },
        });
      }
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }

// Helper method to get the current date (without time)
  getCurrentDate(): string {
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset());
    return currentDate.toISOString().split('T')[0];  // YYYY-MM-DD format
  }

  resetForm(): void {
    this.order = {
      orderRef: '',
      orderDate: this.getCurrentDate(),
      currency: '',
      shipDate: this.getCurrentDate(),
      categoryCode: '',
      lines: [],
    };
    this.errorMessage = null;
    this.successMessage = null;
  }

  onBack() {
    // Navigate back to the orders list
    this.router.navigate(['/orders']);
  }

  protected readonly NgForm = NgForm;
}
