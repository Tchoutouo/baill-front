import { Component } from '@angular/core';
import { ForfaitListComponent } from "../forfait-list/forfait-list.component";
import { ImageViewComponent } from "../image-view/image-view.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EntityServiceService } from '../../../services/admin/entity-service.service';

@Component({
  selector: 'app-form-create',
  standalone: true,
  imports: [ForfaitListComponent, ImageViewComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css'
})
export class FormCreateComponent {

  categoriesList : Array<any>  = [] ;
  images_annouces_list : Array<any> = [];
  images_list : Array<any> = [];
  

  first_name : string = ""
    names : string[] = []

    anounces_form_datas : FormGroup
    title : FormControl
    description : FormControl
    price : FormControl
    contact : FormControl
    country : FormControl
    neighborhood : FormControl
    is_published : FormControl
    status : FormControl
    is_forward : FormControl
    category_id : FormControl

    announce : any = {
      title: '',
      description: '',
      price: 0,
      contact: '',
      country: '',
      neighborhood:  null ,
      is_published: false,
      status: '',
      category_id: null,
      is_forward: false,
      imageList: [''],
    };

  constructor(private form_b : FormBuilder, private entityService : EntityServiceService){

    this.title = this.form_b.control('', [Validators.required, Validators.maxLength(256)])
    this.description = this.form_b.control('', [Validators.required])
    this.price = this.form_b.control('', [ Validators.required])
    this.contact = this.form_b.control('', [] );
    this.neighborhood = this.form_b.control('', [] );
    this.country = this.form_b.control('',  [ Validators.required, Validators.maxLength(256)]);
    this.is_published = this.form_b.control('', [] );
    this.status = this.form_b.control('',  );
    this.is_forward = this.form_b.control('', [] );
    this.category_id = this.form_b.control('', [] );
    
    this.anounces_form_datas = this.form_b.group({
      title : this.title,
      description : this.description,
      price : this.price,
      contact : this.contact,
      country : this.country,
      neighborhood : this.neighborhood,
      is_published : this.is_published,
      status : this.status,
      category_id : this.category_id,
    })
  }

  ngOnInit(){
    window.scroll(0,0);    
  }


  handleSubmit  (event : any | null){

    console.log(this.anounces_form_datas );
    
    if (!this.anounces_form_datas.valid || this.images_annouces_list.length < 1) {
      alert('veuiller remplir les champs requis !')
    }else {
      const entity = "annonce_back/store";
      let datas = this.anounces_form_datas.value;


      const formData = new FormData();
      this.images_annouces_list.forEach((item)=>{
        formData.append('images[]', item);  
      })

      datas.imageList = formData;

      console.log(formData.get('images[]'));
      
      if (event) {
        datas.is_published = true;
      }else{
        datas.is_published = false;
      }
      datas.forfait_id =event; //le forfait choisi
      console.log(datas);
      
      this.entityService.store(entity, datas).subscribe({
        next : (data : any) =>{
          console.log({success: data});
        },

        error: (error : any) => {
          console.log(error);
        }
      })
    }
  }

  getImagesList(event : any){
    this.images_annouces_list = event ;
    console.log(this.images_annouces_list);
    
  }

}
