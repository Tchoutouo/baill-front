import { Component, Input } from '@angular/core';
import { ProductComponent } from "../product/product.component";
import { CommonModule } from '@angular/common';
import { TagsListComponent } from "../tags-list/tags-list.component";
import { HomeService } from '../../../services/guest/home.service';
import { Subscription } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductComponent, CommonModule, TagsListComponent, PaginatorComponent,TranslateModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  numbers: number[] = [1, 2, 3, 4, 2, 3, 4, 5];

  productsList : any;
  pageLimit : number = 12;
  result_datas : any;
  paginationDatas : any ;
  current_page : number=1;
  filterSub : Subscription |undefined ;
  products : any 
  productFiltered : any ;

  constructor(private homeServ : HomeService){}

  ngOnInit(){
    this.initComponent()
  }

  initComponent(){
    this.getAnnoucesList();
  }

  getAnnoucesList(){
    this.productsList = this.homeServ.getAllPublishedAnnouces(this.current_page).subscribe({
    
      next: (datas: any) => { 
        console.log(datas);
        
        if (datas.success == true) {
          if (datas.data_annonce.data) {
            this.products = datas.data_annonce.data ;
            this.result_datas = datas.data_annonce ;
            this.current_page = this.result_datas.current_page;  
            this.paginationDatas = {
              current : this.result_datas.current_page,  
              total : this.result_datas.total,
              next : this.result_datas.current_page + 1,    
              previous : this.result_datas.current_page - 1, 
              last : this.result_datas.last_page, 
            }
          }
        }else{
          this.products = null ;
        }
      },

      error: (erreur: any) => { 
        console.log(erreur);
      }
      
    })
  }

  setPageCurrent(event : any){
    this.current_page = event ;
    this.getAnnoucesList();
  }

  filterDatas(event : any){
    try {
      if (event) {
        this.productFiltered = this.homeServ.filterDataBy(event).subscribe({
          next: (datas: any) => {
            console.log(datas);
            
            if (datas.success = true && datas.annonces != null) {
              console.log({filtre : datas});
                this.products = datas.annonces.data ;
                this.result_datas = datas.annonces ;
                this.current_page = this.result_datas.current_page;  
                this.paginationDatas = {
                  current : this.result_datas.current_page,  
                  total : this.result_datas.total,
                  next : this.result_datas.current_page + 1,    
                  previous : this.result_datas.current_page - 1, 
                  last : this.result_datas.last_page, 
                }
            } else {
              this.products = null ;
            }
          },

          error: (erreur: any) => { 
            console.log(erreur);
            
          }
        })  ;
      }

    } catch (error) {
      console.log('erreur : ', error);
      
    }    
  }

}
