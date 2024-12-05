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
        if (req.url.includes('/login') || req.url.includes('/advertiser_back/store')) {
            // alert('inside')
          // Ne pas ajouter de token pour ces requêtes
          return next.handle(req);
        }
    
        // Si ce n'est pas une requête de login ou d'inscription, ajoutez l'en-tête Authorization
        const token = localStorage.getItem('token');
        const clonedRequest = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(clonedRequest);
    }
}

