import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_IMAGES = 8;
const MIN_DIMENSION = 200;
const MAX_DIMENSION = 4000;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

@Component({
  selector: 'app-image-view',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './image-view.component.html',
  styleUrl: './image-view.component.css'
})
export class ImageViewComponent {
  imageList: string[] = [];
  list_files_image: File[] = [];
  errorMessage = '';
  isChecking = false;

  @Output() imageList_ = new EventEmitter<File[]>();

  constructor(private translate: TranslateService) {}

  handleAddImage(): void {
    const input = document.querySelector<HTMLInputElement>('#imagesList');
    input?.click();
  }

  async addImage(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this.errorMessage = '';

    const remaining = MAX_IMAGES - this.imageList.length;
    if (remaining <= 0) {
      this.errorMessage = this.translate.instant('admin.ads.image-error.max-count', { max: MAX_IMAGES });
      input.value = '';
      return;
    }

    const toProcess = files.slice(0, remaining);
    this.isChecking = true;

    for (const file of toProcess) {
      const err = await this.validateImage(file);
      if (err) {
        this.errorMessage = err;
        continue;
      }

      const dataUrl = await this.readAsDataUrl(file);
      this.imageList.push(dataUrl);
      this.list_files_image.push(file);
    }

    this.isChecking = false;
    this.imageList_.emit(this.list_files_image);
    input.value = '';
  }

  deleteImage(index: number): void {
    this.imageList.splice(index, 1);
    this.list_files_image.splice(index, 1);
    this.imageList_.emit(this.list_files_image);
    if (this.list_files_image.length < MAX_IMAGES) {
      this.errorMessage = '';
    }
  }

  private async validateImage(file: File): Promise<string | null> {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return this.translate.instant('admin.ads.image-error.type');
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return this.translate.instant('admin.ads.image-error.size', { max: MAX_FILE_SIZE_MB });
    }

    const dimError = await this.checkDimensions(file);
    if (dimError) return dimError;

    return null;
  }

  private checkDimensions(file: File): Promise<string | null> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        if (img.width < MIN_DIMENSION || img.height < MIN_DIMENSION) {
          resolve(this.translate.instant('admin.ads.image-error.too-small', { min: MIN_DIMENSION }));
        } else if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
          resolve(this.translate.instant('admin.ads.image-error.too-large', { max: MAX_DIMENSION }));
        } else {
          resolve(null);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(this.translate.instant('admin.ads.image-error.invalid'));
      };
      img.src = url;
    });
  }

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
}
