import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class CategoriaService {

    private apiUrl= " http://localhost:8080/api/category";

    constructor(private http: HttpClient) { }

    list() {
        return this.http.get(this.apiUrl);
    }

    create(data:any){
        return this.http.post(this.apiUrl,data);
    }

    getById(id: number) {   //extraer un objeto
      return this.http.get(`${this.apiUrl}/${id}`);
    }

    edit(id: number, data: any) {
      return this.http.put(`${this.apiUrl}/${id}`, data);
    }

    delete(id: number) {
      return this.http.delete(`${this.apiUrl}/${id}`);
    }
    /* registerReview(data:any){
        let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
        let URL = URL_SERVICIOS+"/ecommerce/review";
        return this.http.post(URL,data,{headers: headers});
    }

    updateReview(data:any,review_id:any){
        let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
        let URL = URL_SERVICIOS+"/ecommerce/review/"+review_id;
        return this.http.put(URL,data,{headers: headers});
    }

    updateUser(data:any){
        let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
        let URL = URL_SERVICIOS+"/ecommerce/update_client";
        return this.http.post(URL,data,{headers: headers});
    }

    showCourse(slug:any){
        let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
        let URL = URL_SERVICIOS+"/ecommerce/course_leason/"+slug;
        return this.http.get(URL,{headers: headers});
    }

    getPdfUrl(slug:any){
        let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
        let URL = URL_SERVICIOS+"/ecommerce/salepdf/"+slug;
        return this.http.get(URL,{headers: headers});
    } */
}
