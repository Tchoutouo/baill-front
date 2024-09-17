import { Component, OnInit } from '@angular/core';
import { getSiteName } from '../../../../helpers/helper';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [],
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
