import { Component, OnInit } from '@angular/core';
import { getSiteName } from '../../../../helpers/helper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [TranslateModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{
  siteName: string ="";
  userName: string ="";
  email: string ="";
  lang: string = "";

  constructor(private translateService: TranslateService){

  }

  ngOnInit(): void {
    this.siteName = getSiteName();
    this.userName = "Marlane";
    this.email = "halle@gmail.com";
    this.lang = localStorage.getItem('lang') || 'fr';

  }


  ChangeLanguage(lang: any){
    const selectedLanguage = lang.target.value;
    localStorage.setItem('lang',selectedLanguage);
    this.translateService.use(selectedLanguage);
  }
}
