import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertConfirmService {
  alert_ = new Alert()
  alert$ = new BehaviorSubject<Alert>(this.alert_);

  constructor() { }

  

  emitAlert(alert : Alert){
    console.log({sevice : alert});
    this.alert$.next(alert);
  }
 
}
