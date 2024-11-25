import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertConfirmService {
  alert = new Alert()
  alert$ = new BehaviorSubject<Alert>(this.alert);

  constructor() { }

  // confirmationSubject = new BehaviorSubject<{ message: string; confirmed: boolean } | null>(null);  
  // confirmation$ = this.confirmationSubject.asObservable();  



  // confirm(message: string): void {  
  //   this.confirmationSubject.next({ message, confirmed: false });  
  // }  

  emitAlert(alert : Alert){
    console.log({sevice : alert});
    
    this.alert$.next(alert)
  }

  // updateConfirmation(confirmed: boolean): void {  
  //   const current = this.confirmationSubject.getValue();  
  //   if (current) {  
  //     this.confirmationSubject.next({ ...current, confirmed });  
  //   }  
  // }  
}
