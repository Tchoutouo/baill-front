import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  private readonly USER_KEY = 'user';

  // Source de vérité unique pour l'utilisateur courant
  private readonly userSubject = new BehaviorSubject<any>(this._read(this.USER_KEY));
  readonly user$ = this.userSubject.asObservable();

  /** Retourne l'utilisateur courant de façon synchrone */
  get currentUser(): any {
    return this.userSubject.value;
  }

  setItem(key: string, value: any): void {
    if (!globalThis?.localStorage) return;
    localStorage.setItem(key, JSON.stringify(value));
    if (key === this.USER_KEY) this.userSubject.next(value);
  }

  getItem(key: string): any {
    return this._read(key);
  }

  removeItem(key: string): void {
    if (!globalThis?.localStorage) return;
    localStorage.removeItem(key);
    if (key === this.USER_KEY) this.userSubject.next(null);
  }

  clear(): void {
    if (!globalThis?.localStorage) return;
    localStorage.clear();
    this.userSubject.next(null);
  }

  private _read(key: string): any {
    if (!globalThis?.localStorage) return null;
    try {
      return JSON.parse(localStorage.getItem(key) as string);
    } catch (e) {
      console.warn(`LocalStorageService: impossible de lire la clé "${key}"`, e);
      return null;
    }
  }
}
