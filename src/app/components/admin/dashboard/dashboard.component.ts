import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertComponent } from '../alert/alert.component';
import { LoaderComponent } from '../loader/loader.component';
import { LocalStorageService } from '../../../services/admin/local-storage.service';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { Subscription } from 'rxjs';
import { CheckProfilService } from '../../../services/check-profil.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AlertComponent, LoaderComponent, TranslateModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {

    dashboardSub : Subscription | undefined;
    isAdmin : boolean = false;
    isLoading : boolean = true;

    // ── KPIs globaux
    total_users: number = 0;
    total_annonces : number = 0;
    total_montant: number = 0;

    // ── Croissance mensuelle
    growth: any = {};

    // ── Tendances (6 mois)
    trend_users: any[] = [];
    trend_annonces: any[] = [];
    trend_revenue: any[] = [];

    // ── Répartitions
    progress_abonnement : any[] = [];
    progress_status: any[] = [];
    users_by_profile: any[] = [];
    revenue_by_mode: any[] = [];

    // ── Activité récente
    recent_users: any[] = [];
    recent_annonces: any[] = [];
    recent_payments: any[] = [];

    // ── Classements
    top_advertisers: any[] = [];
    popular_categories : any[] = [];

    // ── Géographie
    geo_users: any[] = [];
    geo_annonces: any[] = [];

    // ── Modération
    tab_user_lock: any[] = [];

    // ── Annonceur
    totalEncours: number = 0;
    totalEnvoiDExp: number = 0;
    totalExpired: number = 0;
    advertiserRecentAnnonces: any[] = [];
    advertiserUserName: string = '';

    readonly statusLabels: Record<string, string> = {
        '0': 'Expirée', '1': 'En cours', '2': 'Pause', '3': 'Publiée'
    };
    readonly statusColors: Record<string, string> = {
        '0': 'bg-red-10', '1': 'bg-blue-new', '2': 'bg-orange-k5', '3': 'bg-green-15'
    };
    readonly statusBarColors: Record<string, string> = {
        '0': 'red-progress', '1': 'bg-blue', '2': 'orange-30', '3': 'bg-green-main'
    };

    constructor(
        private readonly locaStorage : LocalStorageService,
        private readonly entityService : EntityServiceService,
        private readonly checkProfil: CheckProfilService,
        private readonly cdr: ChangeDetectorRef,
    ){}

    ngOnInit(): void {
      window.scroll(0, 5);
      this.isAdmin = this.checkProfil.isAdmin();
      const user = this.locaStorage.getItem('user');
      this.advertiserUserName = user ? (user.first_name || user.username || '') : '';
      this.getDashboardData();
    }

    getDashboardData(){
      const user = this.locaStorage.getItem('user');
      const user_id = user?.id;
      if (!user_id) return;

      if (this.isAdmin) {
        this.dashboardSub = this.entityService.getDashoardDatasAdmin().subscribe({
          next : (datas : any) => {
            if (datas.success) {
              this.total_users    = datas.total_users;
              this.total_annonces = datas.total_annonces;
              this.total_montant  = datas.total_montant;
              this.growth         = datas.growth ?? {};
              this.trend_users    = datas.trends?.users    ?? [];
              this.trend_annonces = datas.trends?.annonces ?? [];
              this.trend_revenue  = datas.trends?.revenue  ?? [];
              this.progress_abonnement = datas.progress_abonnement ?? [];
              this.progress_status     = datas.progress_status     ?? [];
              this.users_by_profile    = datas.users_by_profile    ?? [];
              this.revenue_by_mode     = datas.revenue_by_mode     ?? [];
              this.recent_users    = datas.recent_users    ?? [];
              this.recent_annonces = datas.recent_annonces ?? [];
              this.recent_payments = datas.recent_payments ?? [];
              this.top_advertisers = datas.top_advertisers ?? [];
              this.popular_categories = datas.tab_categ_popular ?? [];
              this.geo_users    = datas.geo?.users    ?? [];
              this.geo_annonces = datas.geo?.annonces ?? [];
              this.tab_user_lock = datas.tab_user_lock ?? [];
              this.isLoading = false;
              this.cdr.markForCheck();
            }
          },
          error : () => { this.isLoading = false; this.cdr.markForCheck(); },
        });
      } else {
        this.dashboardSub = this.entityService.getDashoardDatas(user_id).subscribe({
          next: (datas: any) => {
            if (datas.success) {
              this.totalEncours  = datas.annonce_qte_publisher ?? 0;
              this.totalEnvoiDExp = datas.annonce_qte_pause ?? 0;
              this.totalExpired  = datas.annonce_qte_expired ?? 0;
              this.advertiserRecentAnnonces = datas.recent_annonces ?? [];
              this.isLoading = false;
              this.cdr.markForCheck();
            }
          },
          error: () => { this.isLoading = false; this.cdr.markForCheck(); },
        });
      }
    }

    /** Retourne la valeur max d'un tableau de trend pour normaliser les barres */
    trendMax(items: any[], field: string): number {
        return Math.max(1, ...items.map(i => i[field] ?? 0));
    }

    /** Couleur d'un badge de croissance */
    growthBadgeClass(rate: number): string {
        return rate > 0 ? 'badge-growth-up' : rate < 0 ? 'badge-growth-down' : 'badge-growth-flat';
    }

    /** Icone d'un badge de croissance */
    growthIcon(rate: number): string {
        return rate > 0 ? '↑' : rate < 0 ? '↓' : '→';
    }
}
