import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products-hightlight',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule],
  templateUrl: './products-hightlight.component.html',
  styleUrl: './products-hightlight.component.css'
})
export class ProductsHightlightComponent {
  @Input() highlights: any[] = [];

  readonly subject       = 'Annonce sur bailleurnet';
  readonly body          = '';
  readonly apiRessources = environment.apiUrlRessources;

  trackByAnnounce(_index: number, item: any): number {
    return item?.id ?? _index;
  }
}
