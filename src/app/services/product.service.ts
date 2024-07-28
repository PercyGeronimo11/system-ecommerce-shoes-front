import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductCreateReq } from '../models/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl +'/product'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<any>(`${this.apiUrl}/list?search`)
  }


  getProductsByCategory(idcategoria: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/listaxcate/${idcategoria}`);
  }



  getProductById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/get/${id}`)
  }

  createProduct(product: FormData) {
    return this.http.post<ProductCreateReq>(`${this.apiUrl}/store`, product);
  }
  
  updateProduct(id: string, product: FormData) {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
