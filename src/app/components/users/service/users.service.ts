import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class UserService {

    private apiUrl= environment.apiUrl+"/api/user";

    constructor(
        private http: HttpClient
    ) { }

    list() {
        return this.http.get(this.apiUrl);
    }

    create(data:any){
        return this.http.post(environment.apiUrl+"/auth/register", data);
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