import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductComponent } from "../product/product.component";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ProductComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
    imagesList : Array<string> = ['']; 
    number_limit : Array<number> = [1, 3, 4, 5] ;
    fisrtImage : string = ''

    constructor(){

    }

    ngOnInit() {
        this.imagesList = ["../../../../assets/products/prodcut-1/1.jpeg", "../../../../assets/products/prodcut-1/2.jpeg", 
           "../../../../assets/products/prodcut-1/3.png",  "../../../../assets/products/prodcut-1/4.jpeg",
        ];

        this.reChangeImage();
    }

    changeFirstImage(event : any){
      this.fisrtImage = event;
    }

    reChangeImage(){
      this.fisrtImage = this.imagesList[0]
    }

}
