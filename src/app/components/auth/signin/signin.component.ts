import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { getSiteName } from '../../../helpers/helper';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [TranslateModule, RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent implements OnInit {
  site_name: string = '';

  typeField: string = 'password';
  loginResult: boolean | null = null;
  isSubmited: boolean = false;
  message_back: string = '';
  icon_eyes: string = '';
  display: string = 'none';

  loginForm: any;
  identifiant: FormControl;
  password: FormControl;

  constructor(private readonly authService: AuthenticatorService, private readonly fb: FormBuilder) {
    this.identifiant = fb.control('', [Validators.required]);
    this.password = fb.control('', [Validators.required]);
  }

  ngOnInit() {
    this.site_name = getSiteName();

    this.loginForm = this.fb.group({
      identifiant: this.identifiant,
      password: this.password,
    });
  }

  toggleIconClass() {
    this.typeField = this.typeField === 'password' ? 'text' : 'password';
    this.icon_eyes = this.icon_eyes === '' ? '-slash' : '';
  }

  showIcon(event: any) {
    const { value } = event.target;
    this.display = value.length >= 1 ? '' : 'none';
  }

  handleSubmite() {
    this.isSubmited = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.signin(this.loginForm.value).subscribe({
      next: (success: boolean) => {
        this.loginResult = success;
        this.displayM();
      },
      error: () => {
        this.loginResult = false;
        this.displayM();
      }
    });
  }

  displayM() {
    this.message_back = this.loginResult
      ? ''
      : "Les informations d'identification ne sont pas correctes.";
  }

  get formControls() {
    return this.loginForm.controls;
  }
}
