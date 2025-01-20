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
    return this.http.get(environment.apiUrl+'categorie_back_public');
  }

  update(id: any, datas: any, entity: string): Observable<any> {
    console.log(environment.apiUrl, datas); 
    
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

  getAllCategories(pageNumber: any, pageLimit: any, query : any = null){
    if (query) {
      console.log(environment.apiUrl+'categorie_back/'+pageLimit+'/'+query+'?page='+pageNumber);
      return this.http.get(environment.apiUrl+'categorie_back/'+pageLimit+'/'+query+'?page='+pageNumber);
    }else{
      console.log(environment.apiUrl+'categorie_back/'+pageLimit+'/'+query+'?page='+pageNumber);
      return this.http.get(environment.apiUrl+'categorie_back/'+pageLimit+'/'+'?page='+pageNumber);
    }
  }

  // USER MANAGEMENT SERVICES
  getAllAdvertisers(pageLImit : number = 5){
    return this.http.get(environment.apiUrl+'advertiser_back/'+pageLImit);
  }

  getAdvertiserByPages(pageLImit : number = 5, pageNumber : number){
    return this.http.get(environment.apiUrl+'advertiser_back/'+pageLImit+'/'+'?page='+pageNumber);
  }

  searchAdvertiserByPage(pageNumber: number , pageLImit : number, query: string ){
    return this.http.get(environment.apiUrl+'advertiser_back/'+pageLImit+'/'+query+'?page='+pageNumber);
  }

  disabledAdvertiser(id: any){
    return this.http.get(environment.apiUrl+'advertiser_bac/change/'+id);
  }

  // FORFAITS | PACKAGES SERVICES
  getAllPackages(pageLImit : number = 5){
    return this.http.get(environment.apiUrl+'abonnement_back/'+pageLImit);
  }

  getAbonnementsByPages(pageLImit : number = 5, pageNumber : number){
    return this.http.get(environment.apiUrl+'abonnement_back/'+pageLImit+'/'+'?page='+pageNumber);
  }

  searchAbonnementsByPage(pageNumber: number , pageLImit : number, query: string ){
    return this.http.get(environment.apiUrl+'abonnement_back/'+pageLImit+'/'+query+'?page='+pageNumber);
  }

  changeStatusAbonnements(id: any){
    return this.http.get(environment.apiUrl+'abonnement_back/status/'+id);
  }

  updateAbonnement(id: any, datas: any, entity: string): Observable<any> {    
    const options = {
      headers: new HttpHeaders({ "Content-Type": "multipart/form-data" }),
    };
    return this.http.put(`${environment.apiUrl+entity}/${id}`, datas);
  }

  deleteAbonnement(abonnement_id : string){
    console.log("abonnement_id", abonnement_id);
    return this.http.delete(environment.apiUrl+'abonnement_back/'+abonnement_id+'/delete');
  }

  updatePamentMethods(datas : any){
    console.log('datas in service');
    return {success :true};
  }

}
