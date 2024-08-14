import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../components/auth/service/auth.service';



@Injectable({
    providedIn: 'root'
  })
export class TransactionService {
   

    private apiUrl= environment.apiUrl+"/api/transaction";

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

}