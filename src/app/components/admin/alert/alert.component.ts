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
  icon_alert : string = "";
  bg_alert : string = "";
  bg_alert_progress : string = "";
  constructor( private alertNotification : NoficationsService){}

  progress: number = 0; 
  notification = new Notification()

  ngOnInit() {  
    this.alertNotification.notification$.subscribe({
      next : (alert : Notification) =>{
        this.notification = alert;
        this.message = this.notification.message
        if (this.notification.status === "success") {
          this.bg_alert = "bg-main-green";
          this.bg_alert_progress = "green-progress";
          this.icon_alert = "fa-check white_icon bg-green-icon";
         
        }else if(this.notification.status === "warning"){
          this.bg_alert = "bg-orangeK5";
          this.bg_alert_progress = "bg-orangeK";
          this.icon_alert = "fa-solid fa-exclamation orange_icon bg-orangeK5";

        }else if(this.notification.status === "danger"){
          this.bg_alert = "bg-main-red";
          this.bg_alert_progress = "red-progress";
          this.icon_alert = "fa-triangle-exclamation red_icon bg-main-red";
        }
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
