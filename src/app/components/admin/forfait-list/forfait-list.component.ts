import { Component, EventEmitter, Output } from '@angular/core';
import { ForfaitItemComponent } from "../forfait-item/forfait-item.component";
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { TranslateModule } from '@ngx-translate/core';
declare const bootstrap: any; // pour accéder à l’API JS de Bootstrap

@Component({
  selector: 'app-forfait-list',
  standalone: true,
  imports: [ForfaitItemComponent, CommonModule, TranslateModule],
  templateUrl: './forfait-list.component.html',
  styleUrl: './forfait-list.component.css'
})
export class ForfaitListComponent {
  list_forfati : Array<any> = ["gsfd", "gg" ,3];  
  entServiceSub : Subscription | undefined;
  abonment_list : Array<any> = [];
  chousedForf : any = null;
  pageLImit : number = 5;

  @Output() hasSubmit = new EventEmitter<any>() ;

  constructor(private entityService : EntityServiceService){

  }

  ngOnInit(){
    this.getAbonnement();
  }

  ngAfterViewInit() {
    const modal = document.getElementById('forfaitList');
    if (modal) {
      modal.addEventListener('hidden.bs.modal', () => {
        // Enlève le focus actif
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
    }
  }

  sendData(forfait: any, quantity: number | null = null) {
    // 1. On crée un nouvel objet, en clonant `forfait`
    const forfaitAvecQuantite = {
      ...forfait,
      selectedQuantity: quantity ?? 1
    };

    console.log(forfaitAvecQuantite);
    
    // 3. On émet l’objet enrichi
    this.hasSubmit.emit(forfaitAvecQuantite);

    // 3. On ferme le modal
    const modalEl = document.getElementById('forfaitList');
    if (modalEl) {
      // récupère l'instance existante (ou crée-la)
      let modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalEl);
      }
      modalInstance.hide();
    }

    // 3. Suppression manuelle éventuelle du backdrop et de la classe body
    // 3. Supprime le backdrop et enlève la classe du body
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    // (optionnel) retire le padding compensatoire que Bootstrap ajoute parfois
    document.body.style.removeProperty('padding-right');

  }

  getAbonnement(){
    this.entServiceSub = this.entityService.getAllPackages(this.pageLImit).subscribe({
      next: (data: any) => { 
        if (data.success) {
          this.abonment_list = data.data.data;
        }
      },

      error: (error: any) => {
        console.log('error forfaits', error);
      }
    })

  }


}
