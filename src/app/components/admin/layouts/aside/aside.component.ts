import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { getSiteName } from '../../../../helpers/helper';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [TranslateModule, RouterLink, CommonModule, RouterModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent implements OnInit{
  siteName: string ="";
  userName: string ="";
  email: string ="";

  @Input() sideBarIsOpen : boolean = false ;

  displayShow : string = "d-none";
  sizeAside : string = ""
  card : string = "col-12 justify-content-center"
  styleImageProf = "shadow-profile";
  width_full : string = "";
  list_width : string = "";
  loggout_content : string = "justify-content-center"

  ngOnInit(): void {
    this.siteName = getSiteName();  
    this.userName = "Marlane Halle";
    this.email = "halle@gmail.com";
  }


  ngOnChanges(changes: SimpleChanges): void {
    
    if (this.sideBarIsOpen) {
      this.displayShow = " ";
      this.sizeAside = "onpenAside"
      this.card = "card"
      this.styleImageProf = ""
      this.width_full = "w_100"
      this.list_width = "w-100"
      this.loggout_content = "justify-content-end p-0"
    }else{
      this.displayShow = "d-none"
      this.sizeAside = " "
      this.card = "col-12 justify-content-center"
      this.styleImageProf = "shadow-profile"
      this.width_full =" "
      this.list_width = " "
      this.loggout_content = "justify-content-center"
    }
  }

  
}
