import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class EntityServiceService {

  constructor(
    private readonly http: HttpClient,
    private readonly translate: TranslateService,
    private readonly localStorage: LocalStorageService,
  ) {}

  /** Clé de profil de l'utilisateur courant — lecture unique depuis le cache BehaviorSubject */
  private get profilCode(): string {
    return this.localStorage.currentUser?.profil_code ?? '';
  }

  private get isAdmin(): boolean {
    return this.profilCode === 'SUP_ADMIN' || this.profilCode === 'ADMIN';
  }

  /** Traduction instantanée (translate.instant évite le subscribe asynchrone) */
  getTranslatedText(key: string): string {
    return this.translate.instant(key);
  }

  getAll(entity: string): Observable<any> {
    return this.http.get(environment.apiUrl + entity);
  }

  store(entity: string, datas: any): Observable<any> {
    return this.http.post(environment.apiUrl + entity, datas);
  }

  getAllAnnoucesCategories(): Observable<any> {
    return this.http.get(environment.apiUrl + 'categorie_back_public');
  }

  update(id: any, datas: any, entity: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}${entity}/${id}`, datas);
  }

  updateCat(id: any, datas: any, entity: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}${entity}/${id}`, datas);
  }

  getUserAnoucesByPages(user_id: any, pageNumber: number, pageLImit = 5): Observable<any> {
    if (this.isAdmin) {
      return this.http.get(`${environment.apiUrl}annonce_back_admin/${pageLImit}?page=${pageNumber}`);
    }
    return this.http.get(`${environment.apiUrl}annonce_back/${user_id}/${pageLImit}?page=${pageNumber}`);
  }

  searchDatasByPage(user_id: any, pageNumber: number, pageLImit: number, query: string): Observable<any> {
    if (this.isAdmin) {
      return this.http.get(`${environment.apiUrl}annonce_back_admin/${pageLImit}/${query}?page=${pageNumber}`);
    }
    return this.http.get(`${environment.apiUrl}annonce_back/${user_id}/${pageLImit}/${query}?page=${pageNumber}`);
  }

  searchCatByPage(pageNumber: number, pageLImit: number, query: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}categorie_back/${pageLImit}/${query}?page=${pageNumber}`);
  }

  changeAnnouceStatus(user_id: any, annouceID: any, newStatus: any, payment_datas: any = null): Observable<any> {
    if (this.isAdmin) {
      const base = `${environment.apiUrl}annonce_back_admin/update_status/${annouceID}/${newStatus}`;
      return this.http.patch(payment_datas ? `${base}/${payment_datas}` : base, {});
    }
    const base = `${environment.apiUrl}annonce_back/update_status/${user_id}/${annouceID}/${newStatus}`;
    return this.http.patch(payment_datas ? `${base}/${payment_datas}` : base, {});
  }

  getAllAbonnements(): Observable<any> {
    return this.http.get(environment.apiUrl + 'abonnement_back');
  }

  deleteAnnouce(annouceID: string | number, catArray: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}annonce_back/delete/${annouceID}/${catArray}`);
  }

  deleteCat(annouceID: string | number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}categorie_back/delete/${annouceID}`);
  }

  getDashoardDatas(user_id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}dashboard_advertiser/${user_id}`);
  }

  getDashoardDatasAdmin(): Observable<any> {
    return this.http.get(environment.apiUrl + 'dashboard_admin');
  }

  getAdvertiser(id: number | string, entity: any): Observable<any> {
    return this.http.get(environment.apiUrl + entity + id);
  }

  getAllCategories(pageNumber: any, pageLimit: any, query: any = null): Observable<any> {
    if (query) {
      return this.http.get(`${environment.apiUrl}categorie_back/${pageLimit}/${query}?page=${pageNumber}`);
    }
    return this.http.get(`${environment.apiUrl}categorie_back/${pageLimit}/?page=${pageNumber}`);
  }

  storeCategory(datas: any): Observable<any> {
    return this.http.post(environment.apiUrl + 'categorie_back/store', datas);
  }

  // ── Gestion des annonceurs ───────────────────────────────────────────────

  getAllAdvertisers(pageLImit = 5): Observable<any> {
    return this.http.get(`${environment.apiUrl}advertiser_back/${pageLImit}`);
  }

  getAdvertiserByPages(pageLImit = 5, pageNumber: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}advertiser_back/${pageLImit}/?page=${pageNumber}`);
  }

  searchAdvertiserByPage(pageNumber: number, pageLImit: number, query: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}advertiser_back/${pageLImit}/${query}?page=${pageNumber}`);
  }

  disabledAdvertiser(id: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}advertiser_back/change/${id}`, {});
  }

  // ── Forfaits / Packages ──────────────────────────────────────────────────

  getAllPackages(pageLImit = 5): Observable<any> {
    return this.http.get(`${environment.apiUrl}abonnement_back/${pageLImit}`);
  }

  getAbonnementsByPages(pageLImit = 5, pageNumber: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}abonnement_back/${pageLImit}/?page=${pageNumber}`);
  }

  searchAbonnementsByPage(pageNumber: number, pageLImit: number, query: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}abonnement_back/${pageLImit}/${query}?page=${pageNumber}`);
  }

  changeStatusAbonnements(id: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}abonnement_back/status/${id}`, {});
  }

  updateAbonnement(id: any, datas: any, entity: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}${entity}/${id}`, datas);
  }

  deleteAbonnement(abonnement_id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}abonnement_back/${abonnement_id}/delete`);
  }

  // ── Paiements ────────────────────────────────────────────────────────────

  updatePamentMethods(datas: any): Observable<any> {
    return this.http.post(environment.apiUrl + 'mode_paiement_back/changeStatus', datas);
  }

  updatePassword(id: number | string, datas: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}updatePassword/${id}`, datas);
  }

  getPaymentMod(): Observable<any> {
    return this.http.get(environment.apiUrl + (this.isAdmin ? 'mode_paiement_back' : 'mode_paiement_advert'));
  }

  getPaymentMethd(): Observable<any> {
    return this.http.get(environment.apiUrl + (this.isAdmin ? 'mode_paiement_back' : 'mode_paiement_advert'));
  }
}
