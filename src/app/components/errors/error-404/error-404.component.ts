import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from "../../user/header/header.component";
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-error-404',
  standalone: true,
  imports: [HeaderComponent, RouterLink, TranslateModule],
  templateUrl: './error-404.component.html',
  styleUrl: './error-404.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Error404Component {

}
