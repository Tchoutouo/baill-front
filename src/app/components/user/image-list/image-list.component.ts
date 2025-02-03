import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

  
@Component({
  selector: 'app-image-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-list.component.html',
  styleUrl: './image-list.component.css'
})
export class ImageListComponent {

  modalImages: any ;
  @Input() images :   Array<string> = [""];
  Newimages :   Array<string> = [""];
  @Output() closeModal = new EventEmitter<any>()
  isClose : boolean = false;
  apiRessources : string = environment.apiUrlRessources;


  constructor(){

  }

  ngOnInit() {
    this.showModal();
  }

  showModal(){
    let wind : any = window ;   
    this.modalImages = new wind["bootstrap"].Modal("#imageListPreview", {keyboard : false}) ;
    this.modalImages.show() ;
    // console.log(this.images[1]) ;
  }

  handleCloseModal(){
    let wind : any = window      
    this.modalImages = new wind["bootstrap"].Modal("#imageListPreview", {keyboard : false})
    this.modalImages.hide() ;
    this.closeModal.emit();
  }
}
