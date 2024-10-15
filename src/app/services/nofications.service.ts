  import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Notification} from '../models/notification'

@Injectable({
  providedIn: 'root'
})
export class NoficationsService {
  notif = new Notification()
  notification$ = new BehaviorSubject<Notification>(this.notif);

  constructor() { }

  emitNotification(alert : Notification){
    this.notification$.next(alert)
  }
}
