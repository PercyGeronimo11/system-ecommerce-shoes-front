import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
  })
export class DepartmentService {

    private apiUrl= environment.apiUrl+"/api/department";

    constructor(private http: HttpClient) { }

    list(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }
    

  getById(idDepa: number) {   //extraer un objeto
    return this.http.get(`${this.apiUrl}/${idDepa}`);
  }

}