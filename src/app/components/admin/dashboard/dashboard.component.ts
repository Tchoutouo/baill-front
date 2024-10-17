import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AlertComponent } from "../alert/alert.component";
import { LocalStorageService } from '../../../services/admin/local-storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

    anounceList : Array<any> = [];

    constructor(private locaStorage : LocalStorageService){

    }


    ngOnInit(){
   
      
      window.scroll(0, 5)
      this.anounceList = ['mvks', "sf", "ksjdf", "skjfd", "dkhfj"]
    }
}
