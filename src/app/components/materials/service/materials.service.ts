import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class MaterialService {

    private apiUrl= "http://127.0.0.1:8080/api/material";

    constructor(
        private http: HttpClient
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