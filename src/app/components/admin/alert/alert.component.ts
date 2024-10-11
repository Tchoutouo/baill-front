import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  @Input() message : any 
  @Output() timeOut = new EventEmitter<any>();

  constructor(){}

  progress: number = 100; 

  ngOnInit() {  
    this.animateProgress();  
  }  

  animateProgress() {  
    const duration = 5000; 
    const interval = 50; 
    const step = (interval / duration) * 100; 

    const intervalId = setInterval(() => {  
      this.progress -= step;  

      // Si la progression atteint 0, arrêtez l'intervalle  
      if (this.progress <= 0) {  
        this.progress = 0;  
        clearInterval(intervalId);  
        this.timeOut.emit(true)
      }  
    }, interval);  
  }  

  
}
