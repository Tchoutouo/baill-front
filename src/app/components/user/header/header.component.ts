import { Component, OnDestroy, OnInit } from '@angular/core';
import { getSiteName } from '../../../helpers/helper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink} from '@angular/router';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { CommonModule } from '@angular/common';
import { ListStateServiceService } from '../../../services/guest/list-state-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule,RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit, OnDestroy {

  emailContact : string = "contact@bailleurnet.com" ;
  siteName : string = "";
  isMenuOpen = false;
  lang: string = "";
  is_auth: boolean = true;
  showBackButton = false;
  private subscription: Subscription = new Subscription();

  constructor( private router: Router, private translateService: TranslateService,private authentificator : AuthenticatorService, private navigationService: ListStateServiceService){

  }

  ngOnInit() {
    this.is_auth = this.authentificator.isAuthenticated();
    this.siteName = getSiteName();
    this.lang = localStorage.getItem('lang') || 'fr';

    this.subscription.add(
      this.navigationService.showBackButton$.subscribe(show => {
        this.showBackButton = show;
      })
    );
  }

  ChangeLanguage(lang: any){
    const selectedLanguage = lang.target.value;
    localStorage.setItem('lang',selectedLanguage);
    this.translateService.use(selectedLanguage);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goBack() {
    this.router.navigate(['/']); // ou la route de votre page d'accueil
  }
}
