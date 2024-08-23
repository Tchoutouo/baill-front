import { Component } from '@angular/core';
import { getSiteName } from '../../../helpers/helper';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {

  emailContact : string = "contact@gmail.com" ;
  siteName : string = ""
  constructor(){}

  ngOnInit() {
    this.siteName = getSiteName();
  }
}
