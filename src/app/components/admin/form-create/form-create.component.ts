import { Component } from '@angular/core';
import { ForfaitListComponent } from "../forfait-list/forfait-list.component";

@Component({
  selector: 'app-form-create',
  standalone: true,
  imports: [ForfaitListComponent],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css'
})
export class FormCreateComponent {

}
