import { Component, OnInit } from '@angular/core';
import { getSiteName } from '../../../helpers/helper';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule, RouterLink, HeaderComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  siteName: string ="";
  currentYear!: number;
  
  ngOnInit(): void {
    this.siteName = getSiteName();
    this.currentYear = new Date().getFullYear();
  }

}
