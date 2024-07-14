import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class ecommerceService {

  private apiUrl = "http://localhost:8080/api/customer";

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get(`${this.apiUrl}`);
  }

  create(customer:any){
    return this.http.post(`${this.apiUrl}`, customer);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }


  edit(id: number, customer: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, customer);
  }


  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

