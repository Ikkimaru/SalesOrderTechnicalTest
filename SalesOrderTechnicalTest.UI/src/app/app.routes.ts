import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {OrdersComponent} from './orders/orders.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'orders', component: OrdersComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/login' }
];
