import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private sharedDataService: SharedDataService) {}

  login(credentials: any) {
    this.logout();
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
    localStorage.removeItem('rolecustomer');
    this.sharedDataService.updateUser(null);
    this.router.navigate(['/ecommers']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCustomer():string | null{

    return localStorage.getItem('username');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
