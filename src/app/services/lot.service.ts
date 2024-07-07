import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LotModel,LotCreateReq } from '../models/lot.model';

@Injectable({
  providedIn: 'root'
})
export class LotService {
  private apiUrl = 'http://127.0.0.1:8080/lot';

  constructor(private http: HttpClient) {}

  getLots() {
    return this.http.get<LotModel[]>(`${this.apiUrl}/list?search`)
  }

  createLot(lot: LotCreateReq) {
    return this.http.post<void>(`${this.apiUrl}/store`, lot);
  }
  
  updateLot(id: number, lot: LotModel): Observable<LotModel> {
    return this.http.put<LotModel>(`${this.apiUrl}/edit/${id}`, lot);
  }

  deleteLot(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
