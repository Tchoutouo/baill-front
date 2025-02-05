import { Component, OnInit } from '@angular/core';
import { getSiteName } from '../../../helpers/helper';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule],
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
