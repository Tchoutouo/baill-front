import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  readonly subject = 'Annonce sur bailleurnet';
  readonly body    = '';

  @Input() productItem: any;
  imageUrl = '';

  ngOnInit(): void {
    if (this.productItem?.url_image?.length) {
      this.imageUrl = this.productItem.url_image[0];
    }
  }
}
