import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('/login') || req.url.includes('/register')) {
          const csrfToken = this.getCsrfToken();
            if (csrfToken) {
              const cloned = req.clone({ headers: req.headers.set('X-CSRF-TOKEN', csrfToken) });
              return next.handle(cloned);
            }
        }

        const raw = localStorage.getItem('token');
        const token = raw?.replace(/['"]+/g, '');

        if (token) {
          const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next.handle(cloned);
        }

        return next.handle(req);
    }

    private getCsrfToken(): string | null {
      return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? null;
    }
}
