import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://127.0.0.1:8080/product/index?search'; // Updated URL

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // createProduct(product: Product): Observable<Product> {
  //   return this.http.post<Product>(`${this.apiUrl}/store`, product);
  // }

  // updateProduct(id: number, product: Product): Observable<Product> {
  //   return this.http.put<Product>(`${this.apiUrl}/edit/${id}`, product);
  // }

  // deleteProduct(id: number): Observable<void> {
  //   // Asegúrate de tener el endpoint de eliminación en tu controlador si es necesario
  //   return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  // }
}
