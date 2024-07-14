import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LotModel,LotCreateReq, LotModelResp } from '../models/lot.model';

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

  getLotService(id: string){
    return this.http.get<any>(`${this.apiUrl}/get/${id}`);
  }

  updateLotService(id: string, lot: LotCreateReq): Observable<LotModel> {
    return this.http.put<LotModel>(`${this.apiUrl}/update/${id}`, lot);
  }

  deleteLot(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

}



