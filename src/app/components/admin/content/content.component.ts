import { Component } from '@angular/core';
import { AsideComponent } from "../layouts/aside/aside.component";
import { NavBarComponent } from '../layouts/nav-bar/nav-bar.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [NavBarComponent, AsideComponent,RouterOutlet, RouterLink],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

}
