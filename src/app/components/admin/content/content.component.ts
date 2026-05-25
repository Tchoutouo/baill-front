import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { getSiteName } from '../../../helpers/helper';
import { LocalStorageService } from '../../../services/admin/local-storage.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { AlertConfirmComponent } from '../../alert-confirm/alert-confirm.component';
import { Alert } from '../../../models/alert';
import { AlertConfirmService } from '../../../services/alert-confirm.service';
import { environment } from '../../../../environments/environment';
import { CheckProfilService } from '../../../services/check-profil.service';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NotificationsComponent,
    CommonModule, RouterModule, AlertConfirmComponent, TranslateModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {

  lang: string = '';
  userName: string = '';
  siteName: string = '';
  email: string = '';
  user_picture: string = '';

  isDiplayedNotification = false;
  display: any;
  isAdmin = false;

  constructor(
    private readonly localStorage: LocalStorageService,
    private readonly route: Router,
    private readonly translateService: TranslateService,
    private readonly authent: AuthenticatorService,
    private readonly alertConfirm: AlertConfirmService,
    private readonly checkProfil: CheckProfilService,
  ) {}

  ngOnInit(): void {
    this.siteName = getSiteName();
    const user = this.localStorage.getItem('user');
    this.userName = user ? (user.first_name || user.username || '') : '';
    this.email = user ? user.email : '';
    this.lang = localStorage.getItem('lang') || 'fr';
    this.user_picture = user?.picture
      ? environment.apiUrlRessources + '/' + user.picture
      : 'false';
    this.isAdmin = this.checkProfil.isAdmin();
  }

  openSideBar(open: boolean): void {
    const sideBar = document.getElementById('sideBar');
    const sideFixed = document.getElementById('fixedParent');
    const textPro = document.getElementById('profil-text');
    const imgProf = document.getElementById('profil-picture');
    const parent = document.getElementById('pict_parent');
    const child = document.getElementById('picture_child');
    const texts = document.getElementsByClassName('text-hover');

    if (open) {
      for (const el of Array.from(texts)) el.classList.remove('d-md-none');
      textPro?.classList.remove('col-md-12');
      imgProf?.classList.remove('col-md-12');
      sideBar?.classList.add('sideOpen');
      sideFixed?.classList.add('sideOpen');
      child?.classList.remove('my_acc_shadow_pic');
      child?.classList.add('my_acc_shadow_pic_mob');
      parent?.classList.remove('my_acc_shadow');
      parent?.classList.add('my_acc_shadow_mob', 'bg-profile_');
    } else {
      for (const el of Array.from(texts)) el.classList.add('d-md-none');
      child?.classList.add('my_acc_shadow_pic');
      child?.classList.remove('my_acc_shadow_pic_mob');
      parent?.classList.add('my_acc_shadow');
      parent?.classList.remove('my_acc_shadow_mob', 'bg-profile_');
      textPro?.classList.add('col-md-12');
      imgProf?.classList.add('col-md-12');
      sideBar?.classList.remove('sideOpen');
      sideFixed?.classList.remove('sideOpen');
    }
  }

  OpenMobileAside(value: boolean): void {
    const sideBar = document.getElementById('sideBar');
    const parent = document.getElementById('pict_parent');
    if (value) {
      sideBar?.classList.add('mobileSideOpen', 'shadow-end');
      parent?.classList.add('bg-profile_');
    } else {
      sideBar?.classList.remove('mobileSideOpen', 'shadow-end');
      parent?.classList.remove('bg-profile_');
    }
  }

  hanndleShowNotifications(): void {
    this.isDiplayedNotification = !this.isDiplayedNotification;
  }

  handleClose(): void {
    this.isDiplayedNotification = false;
  }

  ChangeLanguage(lang: any): void {
    const selected = lang.target.value;
    localStorage.setItem('lang', selected);
    this.translateService.use(selected);
  }

  logOut(event: any): void {
    const alert = new Alert();
    alert.message = ' ';
    alert.cancel_label = ' ';
    alert.success_label = ' ';
    alert.display = false;
    this.alertConfirm.emitAlert(alert);
    this.display = false;
    if (event) {
      this.authent.logOut().subscribe({
        error: () => this.route.navigate(['/signin']),
        complete: () => this.route.navigate(['/signin']),
      });
    }
  }

  handleConfirmLogOut(value: boolean): void {
    const alert = new Alert();
    alert.message = 'Voulez-vous vraiment vous déconnecter ?';
    alert.cancel_label = 'Non';
    alert.success_label = 'Oui';
    alert.display = value;
    this.display = true;
    this.alertConfirm.emitAlert(alert);
  }
}
