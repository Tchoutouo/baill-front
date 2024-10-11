import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { is_image } from '../../../helpers/helper';

@Component({
  selector: 'app-image-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-view.component.html',
  styleUrl: './image-view.component.css'
})
export class ImageViewComponent {
  imageList : Array<string> = []
  list_files_image : Array<any> = [];

  errorMessage : string = "";

  @Output() imageList_ = new EventEmitter<any>()

  
  constructor (){}

  ngOnInit(){

  }

  handleAddImage(event : any){
    const input_file : any = document.querySelector("#imagesList")
    if (input_file) {
      input_file.click()
    }
  }


  addImage(event : any){
    const file_image = event.target.files[0];
    const self : any = this


    if (!is_image(file_image)) {
      this.errorMessage = "Erreur, ceci n'est pas une image  !";

    }

    if (file_image && is_image(file_image)) {
      
      this.errorMessage = "";
      let file_reader = new FileReader() ;

      file_reader.readAsDataURL(file_image)
      file_reader.onload = function(){
        self.imageList.push(file_reader.result)
      }
      this.list_files_image.push(file_image)
      this.imageList_.emit(this.list_files_image);
    }
  }

  deleteImage(index : any){
    this.imageList.splice(index, 1);
    this.list_files_image.splice(index, 1);
    this.imageList_.emit(this.list_files_image);
  }
}

