import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/user/header/header.component";
import { TranslateService } from '@ngx-translate/core';
import { MainComponent } from "./components/user/main/main.component";
import { FooterComponent } from './components/user/footer/footer.component';
import { SpinnerComponent } from './components/global/spinner/spinner.component';
import { AlertComponent } from "./components/admin/alert/alert.component";
import { AlertConfirmComponent } from "./components/alert-confirm/alert-confirm.component";
import { ChatWidgetComponent } from './components/chat-widget/chat-widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HeaderComponent, MainComponent, FooterComponent, SpinnerComponent,
    AlertComponent, AlertConfirmComponent, ChatWidgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  constructor(private readonly translateService: TranslateService){
    this.translateService.setDefaultLang('fr');
    this.translateService.use(localStorage.getItem('lang') || 'fr'); 

  }
  title = 'bailleurnet';
}
