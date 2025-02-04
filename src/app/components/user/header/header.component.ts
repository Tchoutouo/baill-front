import { Component } from '@angular/core';
import { getSiteName } from '../../../helpers/helper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink} from '@angular/router';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule,RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {

  emailContact : string = "contact@bailleurnet.com" ;
  siteName : string = "";
  lang: string = "";
  is_auth: boolean = true;

  constructor(private translateService: TranslateService,private authentificator : AuthenticatorService){

  }

  ngOnInit() {
    this.is_auth = this.authentificator.isAuthenticated();
    this.siteName = getSiteName();
    this.lang = localStorage.getItem('lang') || 'fr';
  }

  ChangeLanguage(lang: any){
    const selectedLanguage = lang.target.value;
    localStorage.setItem('lang',selectedLanguage);
    this.translateService.use(selectedLanguage);
  }
}
