import { Component, EventEmitter, Output } from '@angular/core';
import { PaginatorComponent } from "../../admin/paginator/paginator.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertComponent } from "../alert/alert.component";
import { AnounceEntity } from '../../../models/admin/nounceEntity';
import { getEntityPoperties } from '../../../helpers/helper';
import { FormatEntityNamePipe } from "../../../pipes/format-entity-name.pipe";
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { LocalStorageService } from '../../../services/admin/local-storage.service';
// import { FormatEntityNamePipe } from '../../../helpers/helper';

@Component({
  selector: 'app-announces',
  standalone: true,
  imports: [PaginatorComponent, RouterModule, CommonModule, AlertComponent, FormatEntityNamePipe],
  templateUrl: './announces.component.html',
  styleUrl: './announces.component.css'
})
export class AnnouncesComponent {

  message_alert : any  = null;
  head_anounces_lines : string[] = [];
  headLines : any 
  display_message: boolean = false;
  pageNumber : number = 1;
  pageLImit : number = 5;
  rangeList : any = [5, 10, 15, 25, 30, 35, 40];
  paginationDAtas : any;
  result_data : any;
  annouces : any;
  loged : boolean = false;

  constructor(private entytServ : EntityServiceService, private auth : AuthenticatorService, private localStorage : LocalStorageService){

  }

  ngOnInit(){
    if (this.message_alert) {
      this.display_message = true;
    }

    this.head_anounces_lines = getEntityPoperties('anouces');
    this.headLines = Object.keys(this.head_anounces_lines);
    console.log(this.headLines);

    this.initComponent();
    
  }

  closeAlert(event : any){
    event ? this.display_message = false : this.display_message = false ;
  }

  setPage(page : number){
    this.pageNumber = page ;
    this.getDatasByPage();
  }
  
  setPageLimit(event : any){
    const {name, value} = event.target;
    const pageRange = parseInt(value);
    console.log(pageRange);
    
    if (!isNaN(pageRange)) {
      this.pageLImit = pageRange;
      this.getDatasByPage();
    }
  }

  getDatasByPage(){
    this.loged = this.auth.isAuthenticated();
    // if (this.loged) {
      const user = this.localStorage.getItem('user')
      // const user_id = 6;
      const user_id = user?.id;
      console.log({oetit : this.pageLImit});
      
      this.result_data = this.entytServ.getUserAnoucesByPages(user_id, this.pageNumber ,this.pageLImit).subscribe({
        next: (datas: any) => { 
          console.log(datas);
          this.annouces = datas.annonces.data;
          if (datas.success) {
            this.paginationDAtas = {
              current : datas.annonces.current_page ,
              next : datas.annonces.current_page + 1 ,
              paginateLength : datas.annonces.last_page ,
              previous : datas.annonces.current_page - 1 ,
              allcount : datas.annonces.total ,
            }
          }

          console.log(this.paginationDAtas);
          
          
        },



        error: (error: any) => { 
          console.log(error);
        }
      })
    // }
    // this.result_data = this.entytServ.getAll()
  }

  initComponent(){
    this.getDatasByPage();
  }
  
}
