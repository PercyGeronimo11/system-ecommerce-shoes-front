import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../components/auth/service/auth.service';

@Injectable({
    providedIn: 'root'
  })
export class OrderService {

    private apiUrl= environment.apiUrl+"/api/order";

    constructor(
        private http: HttpClient,
        public authService: AuthService
    ) { }

    list() {
        return this.http.get(this.apiUrl);
    }

    detail(id:any) {
        return this.http.get(this.apiUrl+'/detail/'+id);
    }
}