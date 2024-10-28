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

  progress: number = 0; 
  notification = new Notification()

  ngOnInit() {  
    this.alertNotification.notification$.subscribe({
      next : (alert : Notification) =>{
        this.notification = alert;
        this.message = this.notification.message
        const timout = this.notification.timeout
        this.animateProgress(timout)
      },
    })
    
  }  

  animateProgress(duration: number) {  
    this.progress = 100;  
    const interval = 50;  
    // const interval = 50;  
    const steps = 100 / (duration / interval);  

    const intervalId = setInterval(() => {  
        this.progress -= steps;  
    
        if (this.progress <= 0) {  
            this.progress = 0;  
            clearInterval(intervalId);  
            this.message = null;  
        }  
    }, interval);  
  }

}
