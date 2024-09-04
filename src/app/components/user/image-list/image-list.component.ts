import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  constructor(){

  }

  ngOnInit() {
    this.showModal();
  }

  showModal(){
    let wind : any = window      
    this.modalImages = new wind["bootstrap"].Modal("#imageListPreview", {keyboard : false})
    this.modalImages.show() ;
  }

  handleCloseModal(){
    let wind : any = window      
    this.modalImages = new wind["bootstrap"].Modal("#imageListPreview", {keyboard : false})
    this.modalImages.hide() ;
    this.closeModal.emit();
    
  }
}
