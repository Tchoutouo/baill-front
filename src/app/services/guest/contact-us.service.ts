import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(private http : HttpClient) { }

    sendMailContact(data : any){
      return this.http.post(environment.apiUrl+'home_back/contact', data);
    }
  
}
