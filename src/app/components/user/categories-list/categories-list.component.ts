import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, TranslateModule , FormsModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent {

  @Input() category_list : any;
  @Output() filterDatas = new EventEmitter<any>(); // ou string selon le type
  selectedSort: string | null = null;
  amount_min: number | null = null;
  amount_max: number | null = null;
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
          this.categories = Array.isArray(this.category_list) ? this.category_list : [];
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

  setSort(type: string) {
    this.selectedSort = type;
    this.emitFilter(); 
  }

  emitFilter() {
    const filter = {
      asc: this.selectedSort === 'asc' ? 1 : null, // 'asc' ou 'desc' ou null
      amount_min: this.amount_min, // number ou null
      amount_max: this.amount_max  // number ou null
    };
    
    this.filterDatas.emit(filter);
  }
}


