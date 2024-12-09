import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EntityServiceService } from '../../../../services/admin/entity-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-package-index',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './package-index.component.html',
  styleUrl: './package-index.component.css'
})
export class PackageIndexComponent implements OnInit{
  
  entServiceSub : Subscription | undefined
  abonment_list : Array<any> = [];

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
