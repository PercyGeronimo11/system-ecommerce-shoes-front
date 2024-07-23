import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/service/auth.service';

@Injectable({
    providedIn: 'root'
  })
export class CustomerService {

    private apiUrl= environment.apiUrl+"/api/customer";

    constructor(
        private http: HttpClient,
        public authService: AuthService
    ) { }

    list() {
        return this.http.get(this.apiUrl);
    }

    create(data:any){
        return this.http.post(this.apiUrl, data);
    }

    get(id:any){
        return this.http.get(this.apiUrl+"/"+id);
    }

    edit(id:any, data:any){
        return this.http.put(this.apiUrl+"/"+id, data);
    }

    delete(id:any){
        return this.http.delete(this.apiUrl+"/"+id);
    }
}
