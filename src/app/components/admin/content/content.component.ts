import { Component } from '@angular/core';
import { AsideComponent } from "../layouts/aside/aside.component";
import { NavBarComponent } from '../layouts/nav-bar/nav-bar.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [NavBarComponent, AsideComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

}
