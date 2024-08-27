import { Component, OnInit } from '@angular/core';
import { getSiteName } from '../../../helpers/helper';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  siteName: string ="";
  
  ngOnInit(): void {
    this.siteName = getSiteName();
  }

}
