import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormatTimePipe } from "../../../pipes/format-time.pipe";
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-forfait-item',
  standalone: true,
  imports: [FormatTimePipe,TranslateModule],
  templateUrl: './forfait-item.component.html',
  styleUrl: './forfait-item.component.css'
})
export class ForfaitItemComponent {

  @Input() abonment :any ;
  duration_abnment : number = 1

  constructor (){
  }

  ngOnInit(){
    console.log(this.abonment);
  }
}
