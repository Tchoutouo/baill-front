import { Component } from '@angular/core';
import { ProductComponent } from "../product/product.component";
import { CommonModule } from '@angular/common';
import { TagsListComponent } from "../tags-list/tags-list.component";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductComponent, CommonModule, TagsListComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  numbers: number[] = [1, 2, 3, 4, 2, 3, 4, 5];

  constructor(){}

  ngOnInit(){

  }
}
