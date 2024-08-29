import { Component } from '@angular/core';
import { getSiteName } from '../../../helpers/helper';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  site_name: string = ""

  constructor(){}

  ngOnInit() {
    this.site_name = getSiteName();
  }
}
