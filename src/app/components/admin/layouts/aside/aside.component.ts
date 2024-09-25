import { Component, OnInit } from '@angular/core';
import { getSiteName } from '../../../../helpers/helper';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [TranslateModule, RouterLink, CommonModule, RouterModule],
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
