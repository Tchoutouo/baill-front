import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PackageEditComponent } from "../package-edit/package-edit.component";

@Component({
  selector: 'app-package-index',
  standalone: true,
  imports: [CommonModule, PackageEditComponent],
  templateUrl: './package-index.component.html',
  styleUrl: './package-index.component.css'
})
export class PackageIndexComponent {

  rangeList : number[] = [5, 10, 15, 20, 25]
}
