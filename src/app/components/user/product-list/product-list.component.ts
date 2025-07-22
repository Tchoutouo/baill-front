import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, input, Input, SimpleChanges } from '@angular/core';
import { ProductClickEvent, ProductComponent } from "../product/product.component";
import { CommonModule } from '@angular/common';
import { TagsListComponent } from "../tags-list/tags-list.component";
import { HomeService } from '../../../services/guest/home.service';
import { Subscription } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { isLoggedIn } from '../../../helpers/helper';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductComponent, CommonModule, TagsListComponent, PaginatorComponent,TranslateModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent  implements OnInit, OnDestroy, AfterViewInit{

  numbers: number[] = [1, 2, 3, 4, 2, 3, 4, 5];
  // @Input() filters : any ;
    @Input()
  set filters(value: any) {
    this._filters = value ?? {};
    console.log('Filtres reçus via setter:', this._filters);
    this.handleFilterChange(this._filters);
  }

  get filters() {
    return this._filters;
  }
  private _filters: any = {};
  //productsList : any;
  pageLimit : number = 12;
  result_datas : any;
  paginationDatas : any ;
  current_page : number=1;
  filterSub : Subscription |undefined ;
  products : any 
  //productFiltered : any ;
  private listStateSubscription?: Subscription;
  private productsList?: Subscription;
  private productFiltered?: Subscription;
  
  constructor(private homeServ : HomeService,  private auth: AuthenticatorService,private router : Router, private viewportScroller: ViewportScroller, private translate: TranslateService){}

  ngOnInit(){
    // S'abonner aux changements d'état
    this.listStateSubscription = this.homeServ.getListState().subscribe(state => {
      //console.log("state", state);
      if (state.products.length > 0) {
        this.products = state.products;
        this.result_datas = state.products;
      }
    });
    this.initComponent();
    // if (!this.filters) {
    //   this.filters = {};
    // }
  }


  initComponent(){
    // this.getAnnoucesList();
    this.getAllAnnoncesPublished();
  }

  ngAfterViewInit() {
    // Restaurer la position de scroll après le rendu
    setTimeout(() => {
      this.restoreScrollPosition();
    }, 100);
  }

  ngOnDestroy() {
    // Sauvegarder la position de scroll avant de quitter
    // this.saveCurrentScrollPosition();
    
    // Nettoyer les abonnements
    if (this.productsList) {
      this.productsList.unsubscribe();
    }
    if (this.productFiltered) {
      this.productFiltered.unsubscribe();
    }
    if (this.listStateSubscription) {
      this.listStateSubscription.unsubscribe();
    }
  }

  // Sauvegarder la position de scroll lors du défilement
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.homeServ.saveScrollPosition(scrollPosition);
  }
  getAllAnnoncesPublished(){

    const user = this.auth.isLoggedIn();
    const user_id= user.id ? user.id : null;
    this.productsList = this.homeServ.getAllAnnoucesPublished(user_id).subscribe({
      next: (datas: any) => {
        if (datas.success == true) {
          if (datas.data_annonce) {
            this.products = datas.data_annonce;
            this.result_datas = datas.data_annonce ;
          }
        }else{
          this.products = null ;
        }
      },

      error: (erreur: any) => { 
        console.log("erreur récupération des données home",erreur);
      }
    })
  }

  // ANCIENNE FONCTION POUR LA PAGINATION, n'est plus utilisée actellement
  getAnnoucesList(){
    const user = this.auth.isLoggedIn();
    const user_id= user.id ? user.id : null;
    //console.log({user_id: user_id});
      
    this.productsList = this.homeServ.getAllPublishedAnnouces(this.current_page).subscribe({
    
      next: (datas: any) => { 
        //console.log(datas);
        
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
        console.log("Erreur trie annonces",erreur);
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
          this.filters = {
            ...(this.filters ?? {}),  // si this.filters null/undefined, on prend un objet vide
            ...(event ?? {})          // idem pour event
          };
      }

    } catch (error) {
      console.log('erreur : ', error);
      
    }    
  }

  // Méthode pour naviguer vers les détails d'une annonce
  goToAnnouncementDetails(item: any, index: number) {

    this.homeServ.markAnnouncementAsViewed(index);
    
    // Sauvegarder la position de scroll actuelle
    this.saveCurrentScrollPosition();
    
    // Naviguer vers les détails
    this.router.navigate(['/product-details', item.id], {
      queryParams: { returnIndex: index }
    });
  }

  onProductClick(event: ProductClickEvent) {
    switch(event.action) {
      case 'view_details':
        this.goToAnnouncementDetails(event.product, event.index);
        break;
      default:
        console.log('Action non reconnue:', event.action);
    }
  }

  // Sauvegarder la position de scroll actuelle
  private saveCurrentScrollPosition() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.homeServ.saveScrollPosition(scrollPosition);
  }

  // Restaurer la position de scroll
  private restoreScrollPosition() {
    const savedPosition = this.homeServ.getScrollPosition();
    if (savedPosition > 0) {
      window.scrollTo(0, savedPosition);
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['filters']) {
  //     const current = changes['filters'].currentValue;
  //     console.log('Filtres mis à jour :', current);
  //     // this.handleFilterChange(current);
  //   }
  // }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters']) {
      this.handleFilterChange(changes['filters'].currentValue);
    }
  }

  handleFilterChange(filters: any) {
    const user = this.auth.isLoggedIn();
    const user_id= user.id ? user.id : null;
    const currentLang = this.translate.currentLang; 
    filters.user_id = user_id;
    filters.lang = currentLang;
    const formData = new FormData();
    // formData.append('data', filters);
    formData.append('data', JSON.stringify(filters)); // serialize l'objet
    
    this.productFiltered = this.homeServ.filterDataBy(formData).subscribe({
      next: (datas: any) => {            
        if (datas.success = true && datas.annonces != null) {
            this.products = datas.annonces;
            this.result_datas = datas.annonces ;
            this.current_page = this.result_datas.current_page;  
            // this.paginationDatas = {
            //  current : this.result_datas.current_page,  
            //  total : this.result_datas.total,
            //  next : this.result_datas.current_page + 1,    
            //  previous : this.result_datas.current_page - 1, 
            //  last : this.result_datas.last_page, 
            //}
        } else {
          this.products = null ;
        }
      },
      error: (erreur: any) => { 
        console.log(erreur);
        
      }
    }) ;
    // Ici tu mets la logique pour, par exemple, appeler une API, filtrer localement, etc.
  }
}
