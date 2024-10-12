import { Component, EventEmitter, Output } from '@angular/core';
import { PaginatorComponent } from "../../admin/paginator/paginator.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertComponent } from "../alert/alert.component";

@Component({
  selector: 'app-announces',
  standalone: true,
  imports: [PaginatorComponent, RouterModule, CommonModule, AlertComponent],
  templateUrl: './announces.component.html',
  styleUrl: './announces.component.css'
})
export class AnnouncesComponent {

  message_alert : any  = null;
  display_message: boolean = false;



  constructor(){

  }

  ngOnInit(){
    this.message_alert = "Votre annonce a été enregistrée avec succès !!";
    if (this.message_alert) {
      this.display_message = true;
    }
  }

  closeAlert(event : any){
    event ? this.display_message = false : this.display_message = false ;
    
  }
  
}
