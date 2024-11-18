import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {OrdersComponent} from './orders/orders.component';
import {AddOrderComponent} from './add-order/add-order.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'add-order', component: AddOrderComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/login' }
];
