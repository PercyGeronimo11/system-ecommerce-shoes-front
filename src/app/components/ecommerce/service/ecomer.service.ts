import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class ecommerceService {

  private apiUrl = "http://localhost:8080/api/user";

  constructor(
    private http: HttpClient,
) { }
    create(data:any){
        return this.http.post(this.apiUrl, data);
    }

    get(id:any){
        return this.http.get(this.apiUrl+"/"+id);
    }

    edit(id:any, data:any){
        return this.http.put(this.apiUrl+"/"+id, data);
    }

}
