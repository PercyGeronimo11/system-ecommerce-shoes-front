// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private customerSubject = new BehaviorSubject<any>(this.getCustomerFromLocalStorage());

  private isLoggedInCustomer: boolean = false;
  public isLoggedInChanged = new Subject<boolean>();


  constructor(
    private http: HttpClient, 
    private router: Router
  ) { }

  // Método para actualizar el estado de la sesión
  updateStatusLoginService(isLoggedIn: boolean) {
    this.isLoggedInCustomer = isLoggedIn;
    this.isLoggedInChanged.next(isLoggedIn);
  }

  // Método para obtener el estado actual de la sesión
  get isLoggedInCustomerService(): boolean {
    return this.isLoggedInCustomer;
  }


  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  loginCustomer(credentials: any) {
    this.logoutCustomer();
    return this.http.post(`${this.apiUrl}/auth/login/cliente`, credentials).pipe(
      tap(() => this.updateStatusLoginService(true)) // Aquí se actualiza el estado de login
    );
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
    this.updateStatusLoginService(false); 
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
