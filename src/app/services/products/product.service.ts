import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product, ProductCreate } from '../../models/product/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://127.0.0.1:8080/product'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getProducts() {
    //console.log("esto viene:",this.http.get(this.apiUrl));
    return this.http.get<Product[]>(`${this.apiUrl}/index?search`)
  }

  // createProduct(product: ProductCreate): Observable<Product> {
  //   return this.http.post<Product>(`${this.apiUrl}/store`, product);
  // }

  createProduct(product: FormData): Observable<ProductCreate> {
    return this.http.post<ProductCreate>(`${this.apiUrl}/store`, product);
  }
  
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/edit/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    // Asegúrate de tener el endpoint de eliminación en tu controlador si es necesario
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
