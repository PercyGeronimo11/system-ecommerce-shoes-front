import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductCreateReq, ProductCustomer } from '../models/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductCustomerService {

  private apiUrl = environment.apiUrl +'/api/product-customer';

  constructor(private http: HttpClient) { }

  getRatingProductsService(idCustomer:any) {
    return this.http.get(`${this.apiUrl}/get/ratings/${idCustomer}`);
  }

  saveRatingProductService(productCustomer: ProductCustomer){
    return this.http.post(`${this.apiUrl}/save/ratings`, productCustomer);
  }
  updateClicksService(productCustomer: ProductCustomer){
    return this.http.post(`${this.apiUrl}/update/clicks`, productCustomer)
  }
}

