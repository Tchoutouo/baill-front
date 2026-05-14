import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { userRoleGuard } from './guard/user-role.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/user/main/main.component').then(c => c.MainComponent),
    },
    {
        path: 'signin',
        loadComponent: () => import('./components/auth/signin/signin.component').then(c => c.SigninComponent),
    },
    {
        path: 'signup',
        loadComponent: () => import('./components/auth/signup/signup.component').then(c => c.SignupComponent),
    },
    {
        path: 'product-details/:id',
        loadComponent: () => import('./components/user/product-details/product-details.component').then(c => c.ProductDetailsComponent),
    },
    {
        path: 'image-list',
        loadComponent: () => import('./components/user/image-list/image-list.component').then(c => c.ImageListComponent),
    },
    {
        path: 'contact-us',
        loadComponent: () => import('./components/user/contact-us/contact-us.component').then(c => c.ContactUsComponent),
    },
    {
        path: 'admin',
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
                loadComponent: () => import('./components/admin/dashboard/dashboard.component').then(c => c.DashboardComponent),
                canActivate: [authGuard],
            },
            {
                path: 'settings',
                loadComponent: () => import('./components/admin/settings/settings.component').then(c => c.SettingsComponent),
                canActivate: [authGuard],
            },
            {
                path: 'payment',
                loadComponent: () => import('./components/admin/payment/configuration/configuration.component').then(c => c.ConfigurationComponent),
                canActivate: [authGuard, userRoleGuard],
            },
            {
                path: 'packages',
                loadComponent: () => import('./components/admin/packages/package-index/package-index.component').then(c => c.PackageIndexComponent),
                canActivate: [authGuard, userRoleGuard],
                children: [
                    {
                        path: '',
                        redirectTo: 'packages',
                        pathMatch: 'full',
                    },
                    {
                        path: 'edit/:id',
                        loadComponent: () => import('./components/admin/packages/package-edit/package-edit.component').then(c => c.PackageEditComponent),
                    },
                ],
            },
            {
                path: 'user-management',
                loadComponent: () => import('./components/admin/user-management/users/users.component').then(c => c.UsersComponent),
                canActivate: [authGuard, userRoleGuard],
                children: [
                    {
                        path: 'users',
                        loadComponent: () => import('./components/admin/user-management/user-index/user-index.component').then(c => c.UserIndexComponent),
                    },
                    {
                        path: 'details/:id',
                        loadComponent: () => import('./components/admin/user-management/user-show/user-show.component').then(c => c.UserShowComponent),
                    },
                ],
            },
            {
                path: 'announces',
                loadComponent: () => import('./components/admin/annouce-index/annouce-index.component').then(c => c.AnnouceIndexComponent),
                canActivate: [authGuard],
                children: [
                    {
                        path: 'create',
                        loadComponent: () => import('./components/admin/form-create/form-create.component').then(c => c.FormCreateComponent),
                    },
                    {
                        path: 'announces-list',
                        loadComponent: () => import('./components/admin/announces/announces.component').then(c => c.AnnouncesComponent),
                    },
                    {
                        path: 'details/:id',
                        loadComponent: () => import('./components/admin/annouce-details/annouce-details.component').then(c => c.AnnouceDetailsComponent),
                    },
                ],
            },
            {
                path: 'myAccount',
                loadComponent: () => import('./components/admin/my-account/my-account.component').then(c => c.MyAccountComponent),
                canActivate: [authGuard],
            },
        ],
    },
    {
        path: 'access-interdit',
        loadComponent: () => import('./components/errors/error403/error403.component').then(c => c.Error403Component),
    },
    {
        path: '**',
        loadComponent: () => import('./components/errors/error-404/error-404.component').then(c => c.Error404Component),
    },
];
