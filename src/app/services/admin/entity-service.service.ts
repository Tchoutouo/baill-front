import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class EntityServiceService {

  constructor(private http : HttpClient) { 
  }
  
  getAll(entity:string){
    return this.http.get(environment.apiUrl+entity)
  }

  store(entity:string, datas: any){
    console.log('partir');
    return this.http.post(environment.apiUrl+entity, datas)
  }

  getAllAnnoucesCategories(){
    return this.http.get(environment.apiUrl+'categorie_back');
  }

  update(id: any, datas: any, entity: string): Observable<any> {
    console.log(environment.apiUrl, datas); 
    datas.forEach((value : any, key : any) => {  
      console.log(key, value);  
    });
    const options = {
      headers: new HttpHeaders({ "Content-Type": "multipart/form-data" }),
    };
    // return this.http.put(`${environment.apiUrl+entity}/${id}`, datas, options);
    return this.http.post(environment.apiUrl+entity+'/'+id, datas); 
  }


  getUserAnoucesByPages(user_id : any, pageNumber : number, pageLImit : number = 5){
    return this.http.get(environment.apiUrl+'annonce_back/'+user_id+'/'+pageLImit+'?page='+pageNumber);
  }

  searchDatasByPage(user_id: any , pageNumber: number , pageLImit : number, query: string ){
    // console.log(environment.apiUrl+'annonce_back/'+user_id+'/'+pageLImit+'/'+query+'?page'+pageNumber);
    return this.http.get(environment.apiUrl+'annonce_back/'+user_id+'/'+pageLImit+'/'+query+'?page='+pageNumber);
  }

  changeAnnouceStatus(user_id: any, annouceID: any, newStatus:any){
    return this.http.get(environment.apiUrl+'annonce_back/update_status/'+user_id+'/'+annouceID+'/'+newStatus)
  }

  getAllAbonnements(){
    return this.http.get(environment.apiUrl+'abonnement_back');
  }

  deleteAnnouce(annouceID : string | number, catArray : any){
    console.log(catArray, annouceID);
    
    return this.http.delete(environment.apiUrl+'annonce_back/delete/'+annouceID+'/'+catArray);
  }


  getDashoardDatas(user_id : number){
    return this.http.get(environment.apiUrl+'dashboard_advertiser/'+user_id);
  }

  getAdvertiser(id : number | string, entity: any) : Observable<any>{
    console.log(environment.apiUrl+entity+id);
    return this.http.get(environment.apiUrl+entity+id);
  }

}
