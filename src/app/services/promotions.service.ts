import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PromoCreateReq } from '../models/product.model';
@Injectable({
  providedIn: 'root'
})
export class PromocionService {

  private apiUrl = environment.apiUrl+ "/api/promotion";

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<any>(`${this.apiUrl}/list?search`)
  }
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  list(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  create(promo: PromoCreateReq): Observable<any> {
    return this.http.post(this.apiUrl, promo);
  }

  edit(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
