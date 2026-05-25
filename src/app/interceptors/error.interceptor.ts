import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NoficationsService } from '../services/nofications.service';
import { Notification } from '../models/notification';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private readonly router: Router,
    private readonly notify: NoficationsService,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        switch (err.status) {
          case 401:
            // Session expirée — redirection silencieuse
            this.router.navigate(['/signin']);
            break;

          case 403:
            this.showError('errors.forbidden');
            break;

          case 422:
            // Erreurs de validation — géré localement par chaque composant, pas de toast global
            break;

          case 429:
            this.showError('errors.too-many-requests');
            break;

          case 0:
          case 503:
            this.showError('errors.server-unavailable');
            break;

          default:
            if (err.status >= 500) {
              this.showError('errors.server-error');
            }
        }
        return throwError(() => err);
      })
    );
  }

  private showError(key: string): void {
    const n = new Notification();
    n.message = key;
    n.status  = 'danger';
    n.timeout = 4000;
    this.notify.emitNotification(n);
  }
}
