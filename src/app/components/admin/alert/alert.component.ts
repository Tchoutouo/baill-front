import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NoficationsService } from '../../../services/nofications.service';
import {Notification} from '../../../models/notification'
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  @Input() message : any 
  @Output() timeOut = new EventEmitter<any>();

  constructor( private alertNotification : NoficationsService){}

  progress: number = 100; 
  notification = new Notification()

  ngOnInit() {  
    this.alertNotification.notification$.subscribe({
      next : (alert : Notification) =>{
        this.notification = alert;
        this.message = this.notification.message
        const timout = this.notification.timeout
        this.progress = this.notification.timeout
        this.animateProgress(timout)
      },
    })
    
  }  

  animateProgress(time : any) {  
    const duration = time; 
    const interval = time / 100 ; 
    const step = (interval / duration) * this.progress; 
    console.log(step, interval, duration);

    const intervalId = setInterval(() => {    
      this.progress -= step;  
      // Si la progression atteint 0, arrêtez l'intervalle  
      if (this.progress <= 0) {  
        this.progress = 0;  
        clearInterval(intervalId);  
        this.message = null;
      }  
    }, interval);  
  }  

  
}
