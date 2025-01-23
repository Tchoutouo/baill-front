import { Routes } from '@angular/router';
import { SigninComponent } from './components/auth/signin/signin.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { MainComponent } from './components/user/main/main.component';
import { ProductListComponent } from './components/user/product-list/product-list.component';
import { ProductDetailsComponent } from './components/user/product-details/product-details.component';
import { ImageListComponent } from './components/user/image-list/image-list.component';
import { ContentComponent } from './components/admin/content/content.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { SettingsComponent } from './components/admin/settings/settings.component';
import { MyAccountComponent } from './components/admin/my-account/my-account.component';
import { AnnouncesComponent } from './components/admin/announces/announces.component';
import { FormControlName } from '@angular/forms';
import { AnnouceIndexComponent } from './components/admin/annouce-index/annouce-index.component';
import { FormCreateComponent } from './components/admin/form-create/form-create.component';
import { authGuard } from './guard/auth.guard';
import { AnnouceDetailsComponent } from './components/admin/annouce-details/annouce-details.component';
import { Error404Component } from './components/errors/error-404/error-404.component';
import { ConfigurationComponent } from './components/admin/payment/configuration/configuration.component';
import { UserIndexComponent } from './components/admin/user-management/user-index/user-index.component';
import { UserShowComponent } from './components/admin/user-management/user-show/user-show.component';
import { PackageIndexComponent } from './components/admin/packages/package-index/package-index.component';
import { PackageEditComponent } from './components/admin/packages/package-edit/package-edit.component';
import { UsersComponent } from './components/admin/user-management/users/users.component';
import { Error403Component } from './components/errors/error403/error403.component';
import { userRoleGuard } from './guard/user-role.guard';

export const routes: Routes = [
    { 
        path: '', 
        // component: MainComponent,
        loadComponent: () => import('./components/user/main/main.component').then(c => c.MainComponent)
    },

    { 
        path: 'signin', 
        // component: SigninComponent,
        loadComponent: () => import('./components/auth/signin/signin.component').then(c => c.SigninComponent)
    },
    { 
        path: 'signup', 
        // component: SignupComponent,
        loadComponent: () => import('./components/auth/signup/signup.component').then(c => c.SignupComponent)
    },

    { 
        path: 'product-details/:id', 
        // component: ProductDetailsComponent,
        loadComponent: () => import('./components/user/product-details/product-details.component').then(c => c.ProductDetailsComponent)
    },
    { 
        path: 'image-list', 
        // component: ImageListComponent,
        loadComponent: () => import('./components/user/image-list/image-list.component').then(c => c.ImageListComponent)
    },

    { 
        path: 'admin', 
        // component: ContentComponent,
        loadComponent: () => import('./components/admin/content/content.component').then(c => c.ContentComponent),
        canActivate: [authGuard],
        children: [
            { 
                path: '', 
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            {
                path: 'dashboard',
                // component: DashboardComponent,
                loadComponent: () => import('./components/admin/dashboard/dashboard.component').then(c => c.DashboardComponent),
                canActivate: [authGuard], 
            },
            {
                path: 'settings',
                // component: SettingsComponent,
                loadComponent: () => import('./components/admin/settings/settings.component').then(c => c.SettingsComponent),
                canActivate: [authGuard], 
            },
            {
                path: 'payment',
                // component: ConfigurationComponent,
                loadComponent: () => import('./components/admin/payment/configuration/configuration.component').then(c => c.ConfigurationComponent),
                canActivate: [authGuard,userRoleGuard], 
            },
            {
                path: 'packages',
                // component: PackageIndexComponent,
                loadComponent: () => import('./components/admin/packages/package-index/package-index.component').then(c => c.PackageIndexComponent),
                canActivate: [authGuard,userRoleGuard], 
                children: [
                    { 
                        path: '', 
                        redirectTo: 'packages',
                        pathMatch: 'full',
                    },
                    { 
                        path: 'edit/:id',
                        // component: PackageEditComponent,
                        loadComponent: () => import('./components/admin/packages/package-edit/package-edit.component').then(c => c.PackageEditComponent),
                    },
                ]
            },
            {
                path: 'user-management',
                // component: UsersComponent,
                loadComponent: () => import('./components/admin/user-management/users/users.component').then(c => c.UsersComponent),
                canActivate: [authGuard,userRoleGuard],
                children: [
                    { 
                        path: 'users', 
                        redirectTo: 'user-management',
                        pathMatch: 'full',
                    },
                    { 
                        path: 'users',
                        // component: UserIndexComponent,
                        loadComponent: () => import('./components/admin/user-management/user-index/user-index.component').then(c => c.UserIndexComponent),
                    },
                    { 
                        path: 'details/:id',
                        // component: UserShowComponent,
                        loadComponent: () => import('./components/admin/user-management/user-show/user-show.component').then(c => c.UserShowComponent),
                    },
                ]
            },
            {
                path: 'announces',
                // component: AnnouceIndexComponent,
                loadComponent: () => import('./components/admin/annouce-index/annouce-index.component').then(c => c.AnnouceIndexComponent),
                canActivate: [authGuard],
                children: [
                    { 
                        path: 'create',
                        // component: FormCreateComponent,
                        loadComponent: () => import('./components/admin/form-create/form-create.component').then(c => c.FormCreateComponent),
                    },         
                    { 
                        path: 'announces-list',
                        // component: AnnouncesComponent,
                        loadComponent: () => import('./components/admin/announces/announces.component').then(c => c.AnnouncesComponent),
                    },
                    { 
                        path: 'details/:id',
                        // component: AnnouceDetailsComponent,
                        loadComponent: () => import('./components/admin/annouce-details/annouce-details.component').then(c => c.AnnouceDetailsComponent),
                    },
                ]
            },
            {
                path: 'myAccount',
                // component: MyAccountComponent,
                loadComponent: () => import('./components/admin/my-account/my-account.component').then(c => c.MyAccountComponent),
                canActivate: [authGuard],
            }
        ]
    },
    {
        path: 'access-interdit',
        // component: Error403Component,
        loadComponent: () => import('./components/errors/error403/error403.component').then(c => c.Error403Component)
    },
    {
        path: '**',
        // component: Error404Component,
        loadComponent: () => import('./components/errors/error-404/error-404.component').then(c => c.Error404Component)
    },

];
