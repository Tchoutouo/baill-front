import { HttpInterceptorFn } from '@angular/common/http';

export const corsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Vérifiez si l'URL est pour login ou inscription

        if (req.url.includes('/login') || req.url.includes('/register')) {
          const csrfToken = this.getCsrfToken();
            if (csrfToken) {  
              const cloned = req.clone({ headers: req.headers.set('X-CSRF-TOKEN', csrfToken) });  
              return next.handle(cloned);  
            }  
        }
        
        const token = localStorage.getItem('token');
        if (token) {
          const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next.handle(cloned);
          } else {
          return next.handle(req);
        }

        
    }

    private getCsrfToken(): any {
      return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');  
    }
      
}

