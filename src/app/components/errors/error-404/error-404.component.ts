import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from "../../user/header/header.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-404',
  standalone: true,
  imports: [HeaderComponent, RouterLink],
  templateUrl: './error-404.component.html',
  styleUrl: './error-404.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Error404Component {

}
