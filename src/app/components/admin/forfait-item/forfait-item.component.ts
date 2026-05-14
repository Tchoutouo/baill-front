import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormatTimePipe } from "../../../pipes/format-time.pipe";
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-forfait-item',
  standalone: true,
  imports: [FormatTimePipe,TranslateModule, CommonModule],
  templateUrl: './forfait-item.component.html',
  styleUrl: './forfait-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForfaitItemComponent {

  @Input() abonment :any ;
  duration_abnment : number = 1;
  @Output() selectForfait = new EventEmitter<{ forfait: any; quantity: number }>();

  monList: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  // la quantité sélectionnée (par défaut 1)
  quantity: number = 1;
  abonnment_price: any ;

  constructor (){
  }

  ngOnInit(){
    console.log(this.abonment);
    this.abonnment_price =  this.abonment.price - this.abonment.price * (this.abonment?.remise/100);
  }

  onQuantityChange(event: Event) {
    this.abonnment_price = this.abonment.price - this.abonment.price * (this.abonment?.remise/100);
    const select = event.target as HTMLSelectElement;
    this.quantity = parseInt(select.value, 10) || 1;
    this.abonment.type_value = this.quantity + 'Moi(s)' ;

    this.abonnment_price = this.quantity * this.abonnment_price;
  }

  onSelectClick() {
    // on émet le forfait + la quantité au parent
    this.abonment.price = this.abonnment_price;
    this.selectForfait.emit({ forfait: this.abonment, quantity: this.quantity });
  }

}
