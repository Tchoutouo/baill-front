import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent {

  @Input() category_list : any;
  categories : any[] = [] ;
  categoryList : Subscription | undefined

  constructor(private entitServ : EntityServiceService){

  }

  // ngOnChanges(changes: SimpleChanges) {
  //   this.categories = this.category_list
  //   console.log(this.category_list);
  // }

  ngOnInit(){
    this.categoryList = this.entitServ.getAllAnnoucesCategories().subscribe({
      next: (data: any) => {
        if (data.success) {
          const result = data.data
          this.categories = result  ;
        }
      },

      error: (erreur: any) => { 
        console.log(erreur);
       }
    });
    this.categories = this.category_list
  }
}
