import { Component, OnInit } from '@angular/core';
import { getSiteName } from '../../../helpers/helper';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  siteName: string ="";
  
  ngOnInit(): void {
    this.siteName = getSiteName();
  }
}
