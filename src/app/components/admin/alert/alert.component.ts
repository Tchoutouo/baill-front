import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NoficationsService } from '../../../services/nofications.service';
import { Notification } from '../../../models/notification';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent implements OnInit, OnDestroy {

  @Input() set message(val: Notification | null) {
    if (val) this.applyNotification(val);
  }
  @Output() timeOut = new EventEmitter<boolean>();

  displayText: string | null = null;
  icon_alert        = '';
  bg_alert          = '';
  bg_alert_progress = '';
  progress          = 0;

  private sub!: Subscription;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly alertNotification: NoficationsService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.sub = this.alertNotification.notification$.subscribe((alert: Notification) => {
      this.applyNotification(alert);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.clearTimer();
  }

  private applyNotification(alert: Notification): void {
    this.displayText = alert.message;

    if (alert.status === 'success') {
      this.bg_alert          = 'bg-main-green';
      this.bg_alert_progress = 'green-progress';
      this.icon_alert        = 'fa-check white_icon bg-green-icon';
    } else if (alert.status === 'warning') {
      this.bg_alert          = 'bg-orangeK5';
      this.bg_alert_progress = 'bg-orangeK';
      this.icon_alert        = 'fa-solid fa-exclamation orange_icon bg-orangeK5';
    } else if (alert.status === 'danger') {
      this.bg_alert          = 'bg-main-red';
      this.bg_alert_progress = 'red-progress';
      this.icon_alert        = 'fa-triangle-exclamation red_icon bg-main-red';
    }

    this.animateProgress(alert.timeout);
    this.cdr.markForCheck();
  }

  private animateProgress(duration: number): void {
    this.clearTimer();
    this.progress = 100;
    const step = 100 / (duration / 50);

    this.intervalId = setInterval(() => {
      this.progress = Math.max(0, this.progress - step);
      if (this.progress <= 0) {
        this.clearTimer();
        this.displayText = null;
        this.timeOut.emit(true);
      }
      this.cdr.markForCheck();
    }, 50);
  }

  private clearTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
