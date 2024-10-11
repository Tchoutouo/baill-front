import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AlertComponent } from "../alert/alert.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

    anounceList : Array<any> = [];

    message_alert : any  = null;

    constructor(){

    }

    ngOnInit(){
      this.anounceList = ['mvks', "sf", "ksjdf", "skjfd", "dkhfj"]
    }
}
