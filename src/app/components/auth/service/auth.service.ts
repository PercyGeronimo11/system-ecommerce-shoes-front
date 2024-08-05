// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  //Añadido
  private customerSubject = new BehaviorSubject<any>(this.getCustomerFromLocalStorage());
  //
  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  loginCustomer(credentials: any) {
    this.logoutCustomer();
    return this.http.post(`${this.apiUrl}/auth/login/cliente`, credentials);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  logoutCustomer() {
    localStorage.removeItem('tokencustomer');
    localStorage.removeItem('usernamecustomer');
    this.customerSubject.next(null);
    localStorage.removeItem('rolecustomer');
    localStorage.removeItem('idcustomer');
    this.sharedDataService.updateUser(null);
    this.router.navigate(['/ecommers']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCustomer(): string | null {
    return localStorage.getItem('usernamecustomer');
  getCustomer(): string | null {
    return localStorage.getItem('usernamecustomer');
  }

  getRole(): string | null {
    return localStorage.getItem('rolecustomer');
  }

  getCustomerInfo() {
    return {
      username: localStorage.getItem('usernamecustomer'),
    };
  }
 
  getCustomerObservable() {
    return this.customerSubject.asObservable();
  }

  private getCustomerFromLocalStorage() {
    const usernamecustomer = localStorage.getItem('usernamecustomer');
    const rolecustomer = localStorage.getItem('rolecustomer');
    const tokencustomer = localStorage.getItem('tokencustomer');
    if (usernamecustomer && rolecustomer && tokencustomer) {
      return { usernamecustomer, rolecustomer, tokencustomer };
    }
    return null;
  }

  setCustomer(user: any) {
    localStorage.setItem('usernamecustomer', user.username);
    localStorage.setItem('rolecustomer', user.role);
    localStorage.setItem('tokencustomer', user.token);
    this.customerSubject.next(user);
  }
}
