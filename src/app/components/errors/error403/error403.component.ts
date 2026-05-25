import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from "../../user/header/header.component";
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-error403',
  standalone: true,
  imports: [HeaderComponent, RouterLink, TranslateModule],
  templateUrl: './error403.component.html',
  styleUrl: './error403.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Error403Component {

}
