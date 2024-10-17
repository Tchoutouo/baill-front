import { Component, EventEmitter, Output } from '@angular/core';
import { ForfaitItemComponent } from "../forfait-item/forfait-item.component";
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { EntityServiceService } from '../../../services/admin/entity-service.service';

@Component({
  selector: 'app-forfait-list',
  standalone: true,
  imports: [ForfaitItemComponent, CommonModule],
  templateUrl: './forfait-list.component.html',
  styleUrl: './forfait-list.component.css'
})
export class ForfaitListComponent {
  list_forfati : Array<any> = ["gsfd", "gg" ,3]

  entServiceSub : Subscription | undefined
  abonment_list : Array<any> = [];

  chousedForf : any = null;

  @Output() hasSubmit = new EventEmitter<any>() ;

  constructor(private entityService : EntityServiceService){

  }

  ngOnInit(){
    this.getAbonnement();
  }

  sendData(forfait : any ){
    console.log(forfait);
    this.hasSubmit.emit(forfait)
  }

  getAbonnement(){
    this.entServiceSub = this.entityService.getAllAbonnements().subscribe({
      next: (data: any) => { 
        if (data.success) {
          this.abonment_list = data.data
        }
      },

      error: (error: any) => {  }
    })

  }


}
