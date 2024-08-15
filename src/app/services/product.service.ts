import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductCreateReq, ProductCustomer } from '../models/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl +'/product';
  private apiUrlMl = environment.apiUrlMl +'/product';

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<any>(`${this.apiUrl}/list?search`)
  }

  getProductsRecomendationsByIdUserService(idUser: string) {
    return this.http.get<any>(`${this.apiUrlMl}/recommendations/${idUser}`)
  }

  productDemandPrediction(data:any){
    return this.http.post(`${this.apiUrlMl}/demanding`, data);
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
