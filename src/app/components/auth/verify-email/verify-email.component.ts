import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { getSiteName } from '../../../helpers/helper';

type VerifyState = 'verifying' | 'success' | 'already_verified' | 'invalid' | 'expired' | 'error';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {
  siteName = '';
  state: VerifyState = 'verifying';

  constructor(
    private readonly authService: AuthenticatorService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.siteName = getSiteName();

    const token = this.route.snapshot.paramMap.get('token') ?? '';
    const email  = this.route.snapshot.paramMap.get('email') ?? '';

    if (!token || !email) {
      this.state = 'invalid';
      return;
    }

    this.authService.verifyEmail(token, email).subscribe({
      next: (res) => {
        if (res.success && res.already_verified) {
          this.state = 'already_verified';
        } else if (res.success) {
          this.state = 'success';
        } else if (res.reason === 'expired') {
          this.state = 'expired';
        } else {
          this.state = 'invalid';
        }
      },
      error: (err) => {
        this.state = err.status === 410 ? 'expired' : 'invalid';
      },
    });
  }
}
