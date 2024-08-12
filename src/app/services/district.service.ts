import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class DistrictService {

    private apiUrl= environment.apiUrl+"/api/district";

    constructor(private http: HttpClient) { }

    list() {
      return this.http.get(this.apiUrl);
    }


  getById(idDist: number) {   //extraer un objeto
    return this.http.get(`${this.apiUrl}/${idDist}`);
  }

  getByProvId(idProv: number) {   //extraer un objeto
    return this.http.get(`${this.apiUrl}/province/${idProv}`);
  }
}