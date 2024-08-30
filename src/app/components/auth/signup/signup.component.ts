import { Component } from '@angular/core';
import { getSiteName } from '../../../helpers/helper';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  site_name: string = ""

  constructor(){}

  ngOnInit() {
    this.site_name = getSiteName();
  }
}
