import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { getSiteName } from '../../../helpers/helper';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import QRCodeStyling from 'qr-code-styling';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule, RouterLink, HeaderComponent, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, AfterViewInit {
  siteName: string ="";
  currentYear!: number;
  
  ngOnInit(): void {
    this.siteName = getSiteName();
    this.currentYear = new Date().getFullYear();
  }

  @ViewChild('canvas') canvas!: ElementRef<HTMLDivElement>;

  public qrCodeData: string = 'https://bailleurnet.com'; // Lien de votre site
  public qrWidth: number = 120;
  public qrHeight: number = 120;
  public dotColor: string = '#24583F'; // Couleur des points
  public backgroundColor: string = '#ffffff'; // Couleur de fond
  public dotType: string = 'rounded'; // Forme des points (rounded, dots, square, etc.)
  public logoUrl: string = '../../../../assets/baill-logo.ico'; // URL du logo
  public imageSize: number = 0.4; // Taille relative du logo (0 à 1)
  public imageMargin: number = 1; // Marge autour du logo


  private qrCode: QRCodeStyling | undefined;

  ngAfterViewInit() {
    this.generateQRCode();
  }

  generateQRCode() {
    this.qrCode = new QRCodeStyling({
      width: this.qrWidth,
      height: this.qrHeight,
      data: this.qrCodeData,
      image: this.logoUrl,
      dotsOptions: {
        color: this.dotColor,
        type: this.dotType as any
      },
      backgroundOptions: {
        color: this.backgroundColor
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: this.imageMargin,
        imageSize: this.imageSize // Contrôle la taille du logo
      },
      qrOptions: {
        errorCorrectionLevel: 'H' // Haute correction pour meilleure lisibilité avec logo
      }
    });

    this.qrCode.append(this.canvas.nativeElement);
  }

  updateQRCode() {
    if (this.qrCode) {
      this.canvas.nativeElement.innerHTML = ''; // Effacer le canvas
      this.generateQRCode(); // Régénérer le QR code
    }
  }

  downloadQRCode() {
    if (this.qrCode) {
      this.qrCode.download({ name: 'qr-code-bailleurnet', extension: 'png' });
    }
  }

}
