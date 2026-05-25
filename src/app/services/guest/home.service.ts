import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private homeCache = new Map<string, Observable<any>>();

  constructor(private readonly http: HttpClient) { }

  getAllPublishedAnnouces(pageNumber: number): Observable<any> {
    return this.http.get(environment.apiUrl + 'home_back?page=' + pageNumber);
  }

  getAllAnnoucesPublished(user_logged: any): Observable<any> {
    const key = String(user_logged ?? 'anon');
    if (!this.homeCache.has(key)) {
      this.homeCache.set(key,
        this.http.get(environment.apiUrl + 'home_back/' + user_logged)
          .pipe(shareReplay(1))
      );
    }
    return this.homeCache.get(key)!;
  }

  filterDataBy(data: any): Observable<any> {
    this.homeCache.clear();
    return this.http.post(environment.apiUrl + 'home_back/trie', data);
  }

  getAnnouceByID(id: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'get_annonce/' + id);
  }

  getAnnoucesOfSameCategoyByIds(array_id_cat: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'categorie_back/annonce_by_categ/' + array_id_cat);
  }
}
