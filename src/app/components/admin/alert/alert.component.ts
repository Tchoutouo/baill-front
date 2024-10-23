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

  animateProgress(duration: number) {  
    const interval = 10; // Intervalle en ms  
    const steps = duration / interval; // Nombre d'étapes  
    const step = this.progress / steps; // Montée à chaque intervalle  

    const intervalId = setInterval(() => {  
      this.progress -= step; // Décrémente la progression  
      
      // Vérifier si la progression est inférieure ou égale à 0  
      if (this.progress <= 0) {  
        this.progress = 0; // Assurez-vous qu'il ne soit pas négatif  
        clearInterval(intervalId); // Arrêtez l'intervalle  
        this.message = null; // Masquer le message  
      }  
    }, interval);  
  }  

  
}
