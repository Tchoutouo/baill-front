import { Component } from '@angular/core';
import { AnnouncesComponent } from "../announces/announces.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-annouce-index',
  standalone: true,
  imports: [AnnouncesComponent, RouterOutlet],
  templateUrl: './annouce-index.component.html',
  styleUrl: './annouce-index.component.css'
})
export class AnnouceIndexComponent {

}
