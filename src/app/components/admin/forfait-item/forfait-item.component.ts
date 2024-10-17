import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-forfait-item',
  standalone: true,
  imports: [],
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
