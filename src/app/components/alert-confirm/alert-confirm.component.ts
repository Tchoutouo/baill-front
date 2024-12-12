import { Component, EventEmitter, OnInit, Output, SimpleChange } from '@angular/core';
import { AlertConfirmService } from '../../services/alert-confirm.service';
import { Alert } from '../../models/alert';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-confirm.component.html',
  styleUrl: './alert-confirm.component.css'
})
export class AlertConfirmComponent implements OnInit {

  message : string = '' ;

  validate : string = '' ;

  cancel : string = '';

  alertNoif = new Alert() ;

  alertConfirm : any;

  display : boolean = false;

  deleteSub : Subscription | undefined

  @Output() confirmAction = new EventEmitter<any>()

  constructor(private confirm : AlertConfirmService){ 
  }

  
  ngOnInit(){
    this.confirm.alert$.subscribe({
      next : (alert : Alert) =>{
        if(alert){
          this.message = alert.message
          this.validate = alert.success_label
          this.cancel = alert.cancel_label
          this.display = alert.display
        }
      },
      error : (error : any) =>{
        console.log('error occur' , error);
      }
    })
  }
  
  submitAction(submite : boolean){
    const submiteData = true;
    this.confirmAction.emit(submite)
    console.log('emited');
  }

  ngOnDestroy() {  
      this.confirm.alert$.unsubscribe(); // Pour éviter les fuites de mémoire  
  }  


}


