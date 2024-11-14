import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = { username: '', password: '' };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('http://localhost:3000/auth/login', this.loginData).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        // Store the token in localStorage (or sessionStorage)
        localStorage.setItem('authToken', response.token);

        // Redirect to the orders page
        this.router.navigate(['/orders']);
      },
      error => {
        console.error('Login failed:', error);
      }
    );
  }
}
