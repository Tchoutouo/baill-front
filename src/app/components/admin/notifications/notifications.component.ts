import { Component, EventEmitter, Output } from '@angular/core';
import { NotificationItemComponent } from "../notification-item/notification-item.component";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NotificationItemComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {

  @Output() close  = new EventEmitter<boolean>();

  closeNotifications : boolean = false;

  constructor(){

  }

  ngOnInit(){

  }

  handleCloseNotifs(){
    this.closeNotifications = true;

    this.close.emit(this.closeNotifications);

  }

  
}
