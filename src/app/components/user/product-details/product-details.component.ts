import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductComponent } from "../product/product.component";
import { ImageListComponent } from "../image-list/image-list.component";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ProductComponent, ImageListComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
    imagesList : Array<string> = ['']; 
    number_limit : Array<number> = [1, 3, 4, 5] ;
    fisrtImage : string = '';
    displayButtonMore : boolean = false ;
    differenceLimit : number = 1 ;
    imageLimit : number = 4;
    ImagesSrcs :  any = null;
    displayModal : boolean = false;
    

    constructor(){

    }

    ngOnInit() {
        this.imagesList = ["../../../../assets/products/prodcut-1/1.jpeg", "../../../../assets/products/prodcut-1/2.jpeg", 
           "../../../../assets/products/prodcut-1/3.png",  "../../../../assets/products/prodcut-1/4.jpeg", "../../../../assets/products/prodcut-1/5.jpg",
          "../../../../assets/products/prodcut-1/6.jpg", "../../../../assets/products/prodcut-1/7.jpeg",


          ];

        this.reChangeImage();
        if (this.imagesList.length > 4) {
          this.displayButtonMore = true;
          this.differenceLimit = this.imagesList.length - this.imageLimit;
        }
    }

    changeFirstImage(event : any){
      this.fisrtImage = event;
    }

    reChangeImage(){
      this.fisrtImage = this.imagesList[0]
    }

   
    
  
    showMoreImage(event : any){
      this.ImagesSrcs = this.imagesList ;
      this.displayModal = true;
    }

    closeModal(){
      
      this.ImagesSrcs = false;
      this.displayModal = false;
      console.log(this.ImagesSrcs, this.displayModal);
      
    }


    // ngOnChanges(changes: SimpleChanges) {
    //   if (changes['src'] && this.src) {
    //     this.showModal();
    //   }
    // }

}
