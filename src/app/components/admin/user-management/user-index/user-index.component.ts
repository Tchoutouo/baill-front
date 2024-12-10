import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NoficationsService } from '../../../../services/nofications.service';
import { LocalStorageService } from '../../../../services/admin/local-storage.service';
import { EntityServiceService } from '../../../../services/admin/entity-service.service';
import { User } from '../../../../models/user';
import { Subscription } from 'rxjs';
import { Country } from 'country-state-city';
import { GetContryByCodePipe } from "../../../../pipes/get-contry-by-code.pipe";
import { AlertConfirmService } from '../../../../services/alert-confirm.service';
import { Alert } from '../../../../models/alert';
import { AlertConfirmComponent } from "../../../alert-confirm/alert-confirm.component";

@Component({
  selector: 'app-user-index',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule, GetContryByCodePipe, AlertConfirmComponent],
  templateUrl: './user-index.component.html',
  styleUrl: './user-index.component.css'
})
export class UserIndexComponent implements OnInit{
  
  user!: User;  
  userSub?: Subscription; 
  errorMessage : string = '';
  rangeList: any[] = [5, 10, 15, 20, 25, 30] ;
  userList: any[] = [];
  showAlert : any;


  constructor(  
    private localStorage: LocalStorageService,  
    private entityService: EntityServiceService,  
    private router: Router,  
    private notification: NoficationsService,
    private alertConfirm : AlertConfirmService  
  ){}
  
  ngOnInit(): void {
    this.getAllAdvertisers()
    
  }

  getAllAdvertisers(){
    const entity = "advertiser_back/5";

    this.userSub = this.entityService.getAll(entity).subscribe({
      next: (data: any) => { 
        console.log("data-set",data.data.data);

        if (data.success) {
          this.userList = data.data.data;
        }
      },

      error: (error: any) => {  }
    })
  }

  handleConfirmDisabled(value : boolean){
    let alert = new Alert();
    this.showAlert = true;
    alert.message = "Voulez vous vraiment bloquer cet utilisateur ?"
    alert.cancel_label = "annuler"
    alert.success_label =  "okay"
    alert.display =  value;
    console.log(alert.display);
    this.alertConfirm.emitAlert(alert);

  }
  disabledUser(event : any , user: any){

  }
}
