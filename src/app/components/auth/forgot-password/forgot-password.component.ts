import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { getSiteName } from '../../../helpers/helper';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  siteName = '';
  isLoading = false;
  isSubmitted = false;
  isSuccess = false;
  serverError = '';

  forgotForm!: FormGroup;
  email!: FormControl;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthenticatorService,
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.siteName = getSiteName();
    this.email = this.fb.control('', [Validators.required, Validators.email]);
    this.forgotForm = this.fb.group({ email: this.email });
  }

  showErrors(ctrl: FormControl): boolean {
    return (ctrl.dirty || ctrl.touched || this.isSubmitted) && ctrl.invalid;
  }

  handleSubmit(): void {
    this.isSubmitted = true;
    this.serverError = '';

    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    this.authService.forgotPassword(this.email.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.isSuccess = true;
        } else {
          this.serverError = 'user.forgot-password.error.server';
        }
      },
      error: () => {
        this.isLoading = false;
        this.serverError = 'user.forgot-password.error.server';
      },
    });
  }
}
