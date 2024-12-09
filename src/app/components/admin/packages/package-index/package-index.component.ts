import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EntityServiceService } from '../../../../services/admin/entity-service.service';
import { Subscription } from 'rxjs';
import { PackageEditComponent } from "../package-edit/package-edit.component";

@Component({
  selector: 'app-package-index',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule, PackageEditComponent],
  templateUrl: './package-index.component.html',
  styleUrl: './package-index.component.css'
})
export class PackageIndexComponent implements OnInit{
  
  entServiceSub : Subscription | undefined
  abonment_list : Array<any> = [];
  rangeList: any[] = [5, 10, 15, 20, 25, 30] ;

  constructor(private entityService : EntityServiceService){

  }

  ngOnInit(): void {
    this.getAbonnement();
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
