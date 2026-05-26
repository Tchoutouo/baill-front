import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { getSiteName } from '../../../helpers/helper';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  siteName = '';
  isVerifying = true;
  isTokenValid = false;
  isLoading = false;
  isSubmitted = false;
  isSuccess = false;
  serverError = '';
  showPassword = false;
  showPasswordConfirm = false;

  private token = '';
  private emailParam = '';

  resetForm!: FormGroup;
  password!: FormControl;
  passwordConfirm!: FormControl;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthenticatorService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.siteName = getSiteName();
    this.buildForm();

    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.emailParam = this.route.snapshot.paramMap.get('email') ?? '';

    if (!this.token || !this.emailParam) {
      this.isVerifying = false;
      this.isTokenValid = false;
      return;
    }

    this.authService.verifyResetToken(this.token, this.emailParam).subscribe({
      next: (res) => {
        this.isVerifying = false;
        this.isTokenValid = res.success;
      },
      error: () => {
        this.isVerifying = false;
        this.isTokenValid = false;
      },
    });
  }

  private buildForm(): void {
    this.password        = this.fb.control('', [Validators.required, Validators.minLength(8)]);
    this.passwordConfirm = this.fb.control('', [Validators.required]);
    this.resetForm = this.fb.group(
      { password: this.password, passwordConfirm: this.passwordConfirm },
      { validators: this.passwordsMatchValidator },
    );
  }

  private passwordsMatchValidator(g: FormGroup) {
    const pw  = g.get('password')?.value;
    const cpw = g.get('passwordConfirm')?.value;
    return pw === cpw ? null : { passwordsDoNotMatch: true };
  }

  showErrors(ctrl: FormControl): boolean {
    return (ctrl.dirty || ctrl.touched || this.isSubmitted) && ctrl.invalid;
  }

  handleSubmit(): void {
    this.isSubmitted = true;
    this.serverError = '';

    if (this.resetForm.invalid) return;

    this.isLoading = true;
    this.authService.resetPassword({
      token: this.token,
      email: this.emailParam,
      password: this.password.value,
      password_confirmation: this.passwordConfirm.value,
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.isSuccess = true;
        } else {
          this.serverError = 'user.reset-password.error.server';
        }
      },
      error: () => {
        this.isLoading = false;
        this.serverError = 'user.reset-password.error.server';
      },
    });
  }
}
