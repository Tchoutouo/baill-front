import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListStateServiceService {

  constructor() { }

  private listState = new BehaviorSubject<{
    page: number;
    scrollPosition: number;
    filters: string | null; // Les filtres appliqués (par exemple, la recherche)
  }>({
    page: 1,
    scrollPosition: 0,
    filters: null
  });
  private showBackButtonSubject = new BehaviorSubject<boolean>(false);
  public showBackButton$ = this.showBackButtonSubject.asObservable();
  
  listState$ = this.listState.asObservable();

  updateListState(state: { page?: number; scrollPosition?: number; filters?: string | null }) {
    const currentState = this.listState.getValue();
    this.listState.next({ ...currentState, ...state });
  }

  getListState() {
    return this.listState.getValue();
  }

  setShowBackButton(show: boolean) {
    this.showBackButtonSubject.next(show);
  }

  getShowBackButton(): boolean {
    return this.showBackButtonSubject.value;
  }
}
