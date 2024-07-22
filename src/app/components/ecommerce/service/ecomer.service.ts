import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductModel } from 'src/app/models/product.model';

@Injectable({
    providedIn: 'root'
  })
export class ecommerceService {

  private apiUrl = "http://localhost:8080/api/customer";

  constructor(private http: HttpClient,     private router: Router
  ) { }

  list() {
    return this.http.get(`${this.apiUrl}`);
  }

  logIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError('Something went wrong; please try again later.');
  }

  create(customer:any): Observable<any>{
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

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`);
  }
  
  viewProductDetail(product: ProductModel): void {
    this.router.navigate(['/product', product.id]);
  }

  
}

