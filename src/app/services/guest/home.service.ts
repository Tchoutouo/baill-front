import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http : HttpClient) { }

  getAllPublishedAnnouces(pageNumber : number){
    return this.http.get(environment.apiUrl+'home_back?page='+pageNumber);
  }

  getAllAnnoucesPublished(){
    return this.http.get(environment.apiUrl+'home_back');
  }

  filterDataBy(data : any){
    return this.http.post(environment.apiUrl+'home_back/trie', data);
  }

  getAnnouceByID(id : any){
    return this.http.get(environment.apiUrl+'get_annonce/'+id);
  }

  getAnnoucesOfSameCategoyByIds(array_id_cat : any){
    return this.http.get(environment.apiUrl+'categorie_back/annonce_by_categ/'+array_id_cat); 
  }

}
