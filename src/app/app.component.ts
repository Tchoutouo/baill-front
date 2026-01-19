import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/user/header/header.component";
import { TranslateService } from '@ngx-translate/core';
import { MainComponent } from "./components/user/main/main.component";
import { FooterComponent } from './components/user/footer/footer.component';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/global/spinner/spinner.component';
import { AlertComponent } from "./components/admin/alert/alert.component";
import { AlertConfirmComponent } from "./components/alert-confirm/alert-confirm.component";
import { NgxStripeModule } from 'ngx-stripe';

@Component({
  selector: 'app-root',
  standalone: true,
  
  imports: [RouterOutlet, RouterLink, HeaderComponent, MainComponent, FooterComponent, SpinnerComponent,
    // NgxStripeModule.forRoot('pk_test_51QydBnP1JVeVCDSKAwmszQbjui4iRexbdPLeWmfYwoXpQayltVXrUXwKUPaxyr9pZQq5Yd6GOYibpoZ54L36g0Id00KKkJF9wH'), 
    AlertComponent, AlertConfirmComponent],
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
