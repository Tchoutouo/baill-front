import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class EntityServiceService {

  constructor(private http : HttpClient) { }
  
  getAll(entity:string){
    return this.http.get(environment.apiUrl+entity)
  }


  store(entity:string, datas: any){
    console.log('partir');
    
    return this.http.post(environment.apiUrl+entity, datas)
  }

  getAllAnnoucesCategories(){
    return this.http.get(environment.apiUrl+'categorie_back/');
  }

  update(id: any, datas: any, entity: string): Observable<any> {
    return this.http.put(environment.apiUrl+entity+`/${id}`, datas);
  }


  getAllAbonnements(){
    return this.http.get(environment.apiUrl+'abonnement_back/');
  }
}
