import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-index',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './user-index.component.html',
  styleUrl: './user-index.component.css'
})
export class UserIndexComponent {
  rangeList: any[] = [5, 10, 15, 20, 25, 30] ;
}
