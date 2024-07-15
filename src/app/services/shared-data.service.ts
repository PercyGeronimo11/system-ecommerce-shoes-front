// shared-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private loginResponseSubject = new BehaviorSubject<any>(null);
  loginResponse$ = this.loginResponseSubject.asObservable();

  setLoginResponse(loginResp: any) {
    this.loginResponseSubject.next(loginResp);
  }
}
