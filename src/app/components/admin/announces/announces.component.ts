import { Component } from '@angular/core';
import { PaginatorComponent } from "../../admin/paginator/paginator.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-announces',
  standalone: true,
  imports: [PaginatorComponent, RouterModule],
  templateUrl: './announces.component.html',
  styleUrl: './announces.component.css'
})
export class AnnouncesComponent {

}
