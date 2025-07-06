import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { is_image } from '../../../helpers/helper';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-image-view',
  standalone: true,
  imports: [CommonModule, TranslateModule],
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

  addImage(event: any) {  
    const files = event.target.files;  
  
    for (let i = 0; i < files.length; i++) {  
      const file_image = files[i];  
  
      if (!is_image(file_image)) {  
        this.errorMessage = "Erreur, ceci n'est pas une image !";  
        continue; // Passer à l'image suivante  
      }  
  
      this.errorMessage = "";  
      const file_reader = new FileReader();  
  
      file_reader.readAsDataURL(file_image);  
      file_reader.onload = () => {  
        this.imageList.push(file_reader.result as string);  
        this.list_files_image.push(file_image);  
        this.imageList_.emit(this.list_files_image);  
      };  
    }  
  }

  deleteImage(index : any){
    this.imageList.splice(index, 1);
    this.list_files_image.splice(index, 1);
    this.imageList_.emit(this.list_files_image);
  }
}

