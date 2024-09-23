import { Component, OnInit } from '@angular/core';
import { getSiteName } from '../../../../helpers/helper';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [TranslateModule, RouterLink],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent implements OnInit{
  siteName: string ="";
  userName: string ="";
  email: string ="";

  ngOnInit(): void {
    this.siteName = getSiteName();
    this.userName = "Marlane Halle";
    this.email = "halle@gmail.com";
  }
}
