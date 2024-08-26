import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/user/header/header.component";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private translateService: TranslateService){
    this.translateService.setDefaultLang('fr');
    this.translateService.use(localStorage.getItem('lang') || 'fr'); 

  }
  title = 'baill-front';
}
