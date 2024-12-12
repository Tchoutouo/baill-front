import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AlertConfirmComponent } from './components/alert-confirm/alert-confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { AlertComponent } from './components/admin/alert/alert.component';


@Component({
  selector: 'app-root',
  standalone: true,
  
  imports: [RouterOutlet, RouterLink, AlertConfirmComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private translateService: TranslateService){
    this.translateService.setDefaultLang('fr');
    this.translateService.use(localStorage.getItem('lang') || 'fr'); 

  }
  title = 'bailleurnet';
}
