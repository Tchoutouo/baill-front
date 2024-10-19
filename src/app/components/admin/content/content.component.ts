import { Component } from '@angular/core';
import { AsideComponent } from "../layouts/aside/aside.component";
import { NavBarComponent } from '../layouts/nav-bar/nav-bar.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../user/header/header.component";
import { FooterComponent } from "../../user/footer/footer.component";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [NavBarComponent, AsideComponent, RouterOutlet, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
  
  sizeExpandMain : string | null = null ;

  sizeSideBar : string | null = null ;

  sideBarIsOpen_ : boolean = false;

  constructor(){

  }

  ngOnInit(){

  }

  exendSideBar(){
    this.sizeSideBar = "sizeSideBar";
    this.sizeExpandMain = "sizeExpandMain";
    this.sideBarIsOpen_ = true ;
  }
  
  reduiseSideBar(){
    this.sizeSideBar = null;
    this.sizeExpandMain = null;
    this.sideBarIsOpen_ = false ;
  }
}
