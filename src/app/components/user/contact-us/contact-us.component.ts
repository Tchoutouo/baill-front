import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { ContactUsService } from '../../../services/guest/contact-us.service';
import { NoficationsService } from '../../../services/nofications.service';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { Notification } from '../../../models/notification';
import { AlertComponent } from "../../admin/alert/alert.component";  


@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FormsModule, FooterComponent, HeaderComponent, AlertComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
    contactUsForm: FormGroup;
    fullName: FormControl;
    email: FormControl;
    subject: FormControl;
    message: FormControl;
    message_alert : any  = null;
    display_message: boolean = false;
    
  constructor(private contactUsService: ContactUsService, 
              private notification: NoficationsService, 
              private entityService : EntityServiceService,
              fb: FormBuilder) {

    this.fullName = fb.control("",[Validators.required]);
    this.subject = fb.control("",[Validators.required]);
    this.message = fb.control("",[Validators.required]);
    this.email = fb.control("",[Validators.email, Validators.required]);
    
    this.contactUsForm = fb.group({
      fullName: this.fullName,
      subject: this.subject,
      message: this.message,
      email: this.email
    });
  }

  ngOnInit() {
    window.scroll(0,0)
  }

  submitForm() {
    const datas = this.contactUsForm.value;
    const notif = new Notification();

    console.log("data form", datas);
    
    if (this.contactUsForm.valid) {
      this.contactUsService.sendMailContact(datas).subscribe({
        next : (data : any) =>{
          if(data.success){
            notif.message = this.entityService.getTranslatedText('user.contact-us.message.notif.success');
            notif.status = "success"
            if (this.message_alert) {
              this.display_message = true;
            }
            // this.router.navigate(['/signin']);
          }else{
            notif.message = this.entityService.getTranslatedText('user.contact-us.message.notif.error');
            notif.status = "warning"
          }
          this.notification.emitNotification(notif);
        },
        error: (error : any) => {
          console.log("erreur lors de l'envoi du mail dans contact us:",error);
        }
      })

    } else {
      alert('Please correct the errors in the form');
    }
  }

  closeAlert(event : any){
    event ? this.display_message = false : this.display_message = false ;
  }
}
