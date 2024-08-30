import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { getSiteName } from '../../../helpers/helper';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  site_name: string = ""

  constructor(){}

  ngOnInit() {
    this.site_name = getSiteName();
  }
  
}
