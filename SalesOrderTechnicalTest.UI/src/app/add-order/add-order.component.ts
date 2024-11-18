import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormsModule, NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import {NewOrder, NewOrderLine, OrderService} from '../services/order.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-add-order',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.css'
})
export class AddOrderComponent implements OnInit{
  order: NewOrder = {
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

  orderDate: string | undefined;  // To store the current date for Order Date field
  currentDate: string | undefined;  // To store the current date and time for Ship Date field

  constructor(private http: HttpClient, private router: Router,private orderService: OrderService) { }

  ngOnInit(): void {
    // Set orderDate to the current date in 'YYYY-MM-DD' format
    this.orderDate = new Date().toISOString().split('T')[0];
    this.currentDate = this.getCurrentDate();  // Extract only the date part (YYYY-MM-DD)

    // Set the shipDate to currentDate (current date without time)
    this.order.shipDate = this.currentDate;
  }

  onShipDateChange(): void {
    // Update the maxOrderDate whenever the shipDate is changed
    const shipDate = new Date(this.order.shipDate);
    shipDate.setDate(shipDate.getDate() + 1);  // Make sure Order Date is not later than Ship Date
    this.currentDate = shipDate.toISOString().split('T')[0];  // Set max date for Order Date (YYYY-MM-DD)
  }

  addLine() {
    this.order.lines.push({ ...this.newLine });
    this.newLine = { sku: '', qty: 0, desc: '' }; // Reset input fields
  }

  removeOrderLine(index: number) {
    this.order.lines.splice(index, 1);
  }

  onSubmit(form: { valid: any; }) {
    if (form.valid) {
      this.orderService.addOrder(this.order).subscribe({
        next: (response) => {
          console.log('Order submitted successfully:', response);

          // Success message
          this.successMessage = 'Order submitted successfully!';

          // Reset the form
          this.order = {
            orderRef: '',
            orderDate: '',
            currency: '',
            shipDate: this.getCurrentDate(),  // Set the ship date to the current date
            categoryCode: '',
            lines: [],
          };
          this.errorMessage = null;

          // Clear success message after 3 seconds
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: (err) => {
          console.error('Error submitting order:', err);
          this.errorMessage = 'Failed to submit order. Please try again.';
        },
      });
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


  onBack() {
    // Navigate back to the orders list
    this.router.navigate(['/orders']);
  }

  protected readonly NgForm = NgForm;
}
