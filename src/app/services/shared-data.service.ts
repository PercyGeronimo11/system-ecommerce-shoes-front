import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    this.loadUser();
  }

  private loadUser() {
    const username = localStorage.getItem('usernamecustomer');
    const role = localStorage.getItem('rolecustomer');
    if (username && role) {
      this.userSubject.next({ username, role });
    }
  }

  updateUser(user: any): void {
    if (user) {
      localStorage.setItem('usernamecustomer', user.username);
      localStorage.setItem('rolecustomer', user.role);
    } else {
      localStorage.removeItem('usernamecustomer');
      localStorage.removeItem('rolecustomer');
    }
    this.userSubject.next(user);
  }
}
