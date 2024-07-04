import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product, ProductCreateReq } from '../../models/product/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://127.0.0.1:8080/product'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<Product[]>(`${this.apiUrl}/list?search`)
  }

  // createProduct(product: ProductCreate): Observable<Product> {
  //   return this.http.post<Product>(`${this.apiUrl}/store`, product);
  // }

  createProduct(product: FormData) {
    return this.http.post<ProductCreateReq>(`${this.apiUrl}/store`, product);
  }
  
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/edit/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    // Asegúrate de tener el endpoint de eliminación en tu controlador si es necesario
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
  private showModal = new Subject<boolean>();

  showModal$ = this.showModal.asObservable();

  openModal() {
    this.showModal.next(true);
  }

  closeModal() {
    this.showModal.next(false);
  }
}
