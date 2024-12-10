import { Component, inject } from '@angular/core';
import { AsideComponent } from "../layouts/aside/aside.component";
import { NavBarComponent } from '../layouts/nav-bar/nav-bar.component';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../user/header/header.component";
import { FooterComponent } from "../../user/footer/footer.component";
import { getSiteName } from '../../../helpers/helper';
import { LocalStorageService } from '../../../services/admin/local-storage.service';
import { NotificationsComponent } from "../notifications/notifications.component";
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AlertComponent } from "../alert/alert.component";
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { AlertConfirmComponent } from '../../alert-confirm/alert-confirm.component';
import { Alert } from '../../../models/alert';
import { AlertConfirmService } from '../../../services/alert-confirm.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NotificationsComponent,
    CommonModule, RouterModule, AlertConfirmComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
  
  sizeExpandMain : string | null = null ;
    
  lang: string = "";

  userName: string ="";
  siteName: string ="";
  email: string ="";
  user_picture : string = ''

  sizeSideBar : string | null = null ;

  sideBarIsOpen_ : boolean = false;
  isDiplayedNotification : boolean  = false ;
  display: any 

  constructor(private localStorage : LocalStorageService, private route : Router ,
    private translateService: TranslateService, private authent : AuthenticatorService, private alertConfirm : AlertConfirmService){
  }

  ngOnInit(){
    this.sizeSideBar = null;
    this.sizeExpandMain = null;
    this.sideBarIsOpen_ = false ;
    this.siteName = getSiteName();
    const user = this.localStorage.getItem('user');
    this.userName = user ? user.first_name : null;
    this.email = user ? user.email : '';
    this.lang = localStorage.getItem('lang') || 'fr';
    this.user_picture = user.picture ?  environment.apiUrlRessources + '/' + user.picture : 'false' ;  

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

  closeSideBar(){
    this.sizeSideBar = null;
    this.sizeExpandMain = null;
    this.sideBarIsOpen_ = false ;
  }

  openSideBar(open : boolean){
    let sideBar = document.getElementById('sideBar') ;
    let textsToShow = document.getElementsByClassName('text-hover') ;
    let sideFixed = document.getElementById('fixedParent') ;
    let text_pro = document.getElementById('profil-text') ;
    let img_prof = document.getElementById('profil-picture') ;
    let prent = document.getElementById('pict_parent') ;
    let enf = document.getElementById('picture_child') ;


    if (open) {
      for (let i = 0; i < textsToShow.length; i++) {  
          textsToShow[i].classList.remove('d-md-none'); // Remplacez 'nouvelle-classe' par le nom de la classe à ajouter  
      }  
      text_pro?.classList.remove('col-md-12')
      img_prof?.classList.remove('col-md-12')
      sideBar?.classList.add('sideOpen');
      sideFixed?.classList.add('sideOpen');
      enf?.classList.remove('my_acc_shadow_pic')
    prent?.classList.remove('my_acc_shadow')
    enf?.classList.add('my_acc_shadow_pic_mob')
      prent?.classList.add('my_acc_shadow_mob')
      prent?.classList.add('bg-profile_')
    }else{
      for (let i = 0; i < textsToShow.length; i++) {  
          textsToShow[i].classList.add('d-md-none'); // Remplacez 'nouvelle-classe' par le nom de la classe à ajouter  
      }  
      enf?.classList.add('my_acc_shadow_pic')
      prent?.classList.add('my_acc_shadow')
    text_pro?.classList.add('col-md-12')
    img_prof?.classList.add('col-md-12')
      sideBar?.classList.remove('sideOpen');
      sideFixed?.classList.remove('sideOpen');
      enf?.classList.remove('my_acc_shadow_pic_mob')
      prent?.classList.remove('my_acc_shadow_mob')
      prent?.classList.remove('bg-profile_')
    }
  }

  OpenMobileAside(value : boolean){
    let sideBar = document.getElementById('sideBar');
    let prent = document.getElementById('pict_parent') ;

    if (value) {
      sideBar?.classList.add('mobileSideOpen');
      sideBar?.classList.add('shadow-end');
      prent?.classList.add('bg-profile_')
    }else{
      sideBar?.classList.remove('mobileSideOpen');
      prent?.classList.remove('bg-profile_')
      sideBar?.classList.remove('shadow-end');
    }
  }

  hanndleShowNotifications(){
    this.isDiplayedNotification = !this.isDiplayedNotification
  }

  handleClose(){
    this.isDiplayedNotification = false;
  }

  ChangeLanguage(lang: any){
    const selectedLanguage = lang.target.value;
    localStorage.setItem('lang',selectedLanguage);
    this.translateService.use(selectedLanguage);
  }

  logOut(event : any){
    let alert = new Alert();
    alert.message = " "
    alert.cancel_label = " "
    alert.success_label =  " "
    alert.display =  false;
    console.log(alert.display);
    this.alertConfirm.emitAlert(alert)
    this.display = true;

    if (event) {
      this.authent.logOut();
      return this.route.navigate(['/signin']);
    }
    return;
  }

  handleConfirmLogOut(value : boolean){
    let alert = new Alert();
    alert.message = "Voulez-vous vraiment vous déconnecter ?"
    alert.cancel_label = "non"
    alert.success_label =  "oui"
    alert.display =  value;
    this.display = false;
    this.alertConfirm.emitAlert(alert);
  }
}
