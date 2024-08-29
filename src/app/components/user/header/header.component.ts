import { Component } from '@angular/core';
import { getSiteName } from '../../../helpers/helper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {

  emailContact : string = "contact@gmail.com" ;
  siteName : string = "";
  lang: string = "";

  constructor(private translateService: TranslateService){

  }

  ngOnInit() {
    this.siteName = getSiteName();
    this.lang = localStorage.getItem('lang') || 'fr';
  }

  ChangeLanguage(lang: any){
    const selectedLanguage = lang.target.value;
    localStorage.setItem('lang',selectedLanguage);
    this.translateService.use(selectedLanguage);
  }
}
