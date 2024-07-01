import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class PromocionService {

    private apiUrl= " http://localhost:8080/api/promotion";

    constructor(private http: HttpClient) { }

    list() {
        return this.http.get(this.apiUrl);
    }

    create(data:any){
        return this.http.post(this.apiUrl,data);
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
