import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

interface ListState {
  products: any[];
  scrollPosition: number;
  currentPage: number;
  searchFilters: any;
  lastViewedIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  
  // Cache pour les données
  private annoncesCache: any[] = [];
  private cacheValid = false;
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // État de la liste
  private listState = new BehaviorSubject<ListState>({
    products: [],
    scrollPosition: 0,
    currentPage: 1,
    searchFilters: null,
    lastViewedIndex: -1
  });

  constructor(private http: HttpClient) { }

  // Méthodes pour gérer l'état de la liste
  getListState(): Observable<ListState> {
    return this.listState.asObservable();
  }

  updateListState(partialState: Partial<ListState>) {
    const currentState = this.listState.value;
    this.listState.next({ ...currentState, ...partialState });
  }

  // Sauvegarder la position de scroll
  saveScrollPosition(position: number) {
    sessionStorage.setItem('homeScrollPosition', position.toString());
    this.updateListState({ scrollPosition: position });
  }

  // Récupérer la position de scroll
  getScrollPosition(): number {
    const saved = sessionStorage.getItem('homeScrollPosition');
    return saved ? parseInt(saved, 10) : 0;
  }

  // Marquer l'annonce vue
  markAnnouncementAsViewed(index: number) {
    this.updateListState({ lastViewedIndex: index });
    sessionStorage.setItem('lastViewedIndex', index.toString());
  }

  // Récupérer l'index de la dernière annonce vue
  getLastViewedIndex(): number {
    const saved = sessionStorage.getItem('lastViewedIndex');
    return saved ? parseInt(saved, 10) : -1;
  }

  // Vérifier si le cache est valide
  private isCacheValid(): boolean {
    const now = Date.now();
    return this.cacheValid && (now - this.cacheTimestamp) < this.CACHE_DURATION;
  }

  getAllPublishedAnnouces(pageNumber : number){
    console.log(environment.apiUrl+'home_back?page='+pageNumber);
    return this.http.get(environment.apiUrl+'home_back?page='+pageNumber);
  }
  // Version améliorée avec cache
  getAllAnnoucesPublished(user_logged: any): Observable<any> {
    // Si on a des données en cache et qu'elles sont valides
    if (this.isCacheValid() && this.annoncesCache.length > 0) {
      console.log('Données récupérées depuis le cache');
      return of({
        success: true,
        data_annonce: this.annoncesCache
      });
    }

    console.log(environment.apiUrl + 'home_back/' + user_logged);
    return this.http.get(environment.apiUrl + 'home_back/' + user_logged).pipe(
      tap((response: any) => {
        if (response.success && response.data_annonce) {
          // Mettre en cache les données
          this.annoncesCache = response.data_annonce;
          this.cacheValid = true;
          this.cacheTimestamp = Date.now();
          
          // Mettre à jour l'état
          this.updateListState({ products: response.data_annonce });
        }
      })
    );
  }

  filterDataBy(data: any): Observable<any> {
    // Invalider le cache lors d'une recherche
    this.invalidateCache();
    
    return this.http.post(environment.apiUrl + 'home_back/trie', data).pipe(
      tap((response: any) => {
        if (response.success && response.annonces) {
          // Sauvegarder les filtres appliqués
          this.updateListState({ 
            searchFilters: data,
            products: response.annonces,
            scrollPosition: 0 // Reset scroll pour les résultats de recherche
          });
        }
      })
    );
  }

  getAnnouceByID(id: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'get_annonce/' + id);
  }

  getAnnoucesOfSameCategoyByIds(array_id_cat: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'categorie_back/annonce_by_categ/' + array_id_cat);
  }

  // Invalider le cache
  invalidateCache() {
    this.cacheValid = false;
    this.annoncesCache = [];
    this.cacheTimestamp = 0;
  }

  // Nettoyer les données de session (à appeler lors de la déconnexion)
  clearSessionData() {
    sessionStorage.removeItem('homeScrollPosition');
    sessionStorage.removeItem('lastViewedIndex');
    this.listState.next({
      products: [],
      scrollPosition: 0,
      currentPage: 1,
      searchFilters: null,
      lastViewedIndex: -1
    });
  }
}