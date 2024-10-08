import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductModel } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class ecommerceService {

  private apiUrl = environment.apiUrl +"/api/customer";

  constructor(private http: HttpClient,     private router: Router
  ) { }

  list() {
    return this.http.get(`${this.apiUrl}`);
  }

  create(customer: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, customer).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Something went wrong; please try again later.';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    return throwError(errorMessage);
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

