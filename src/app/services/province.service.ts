import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class ProvinceService {

    private apiUrl= environment.apiUrl+"/api/province";

    constructor(private http: HttpClient) { }

    list() {
      return this.http.get(this.apiUrl);
    }



  getById(idProv: number) {   //extraer un objeto
    return this.http.get(`${this.apiUrl}/${idProv}`);
  }

  getByDepId(departmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/department/${departmentId}`);
  }
  
 
  
}