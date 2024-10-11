import { Component, EventEmitter, Output } from '@angular/core';
import { ForfaitItemComponent } from "../forfait-item/forfait-item.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forfait-list',
  standalone: true,
  imports: [ForfaitItemComponent, CommonModule],
  templateUrl: './forfait-list.component.html',
  styleUrl: './forfait-list.component.css'
})
export class ForfaitListComponent {
  list_forfati : Array<any> = ["gsfd", "gg" ,3]

  chousedForf : any = null;

  @Output() hasSubmit = new EventEmitter<any>() ;

  constructor(){

  }

  ngOnInit(){
  }

  sendData(forfait : any ){
    console.log(forfait);
    this.hasSubmit.emit(forfait)
  }



}
