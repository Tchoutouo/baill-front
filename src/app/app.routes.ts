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

export const routes: Routes = [
    { 
        path: '', 
        component: MainComponent 
    },
    { 
        path: 'signin', 
        component: SigninComponent 
    },
    { 
        path: 'signup', 
        component: SignupComponent 
    },

    { 
        path: 'product-details/:id', 
        component: ProductDetailsComponent , 
    },
    

    { 
        path: 'image-list', 
        component: ImageListComponent 
    },
    { 
        path: 'admin', 
        component: ContentComponent,
        // canActivate: [authGuard],
        children: [
            { 
                path: '', 
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            
            {
                path: 'dashboard',
                component: DashboardComponent,
                // canActivate: [authGuard], 
            },

            {
                path: 'settings',
                component: SettingsComponent,
                canActivate: [authGuard], 
            },
            {
                path: 'payment',
                component: ConfigurationComponent,
                // canActivate: [authGuard], 
            },
            {
                path: 'packages',
                component: PackageIndexComponent,
                // canActivate: [authGuard], 
                children: [
                    { 
                        path: '', 
                        redirectTo: 'packages',
                        pathMatch: 'full',
                        
                    },
                    { 
                        path: 'edit/:id',
                        component: PackageEditComponent,
                        
                    },
                ]
            },
            {
                path: 'user-management',
                component: UsersComponent,
                // canActivate: [authGuard], 
                children: [
                    { 
                        path: 'users', 
                        redirectTo: 'user-management',
                        pathMatch: 'full',
                        
                    },
                    { 
                        path: 'users',
                        component: UserIndexComponent,
                        
                    },
                    { 
                        path: 'details/:id',
                        component: UserShowComponent,
                        
                    },
                ]
            },
            {
                path: 'announces',
                component: AnnouceIndexComponent,
                // canActivate: [authGuard],
                children: [
                    { 
                        path: 'create',
                        component: FormCreateComponent,
                        
                    },
                    
                    { 
                        path: 'announces-list',
                        component: AnnouncesComponent,
                    },
                    
                    { 
                        path: 'details/:id',
                        component: AnnouceDetailsComponent,
                    },
                ]
            },
            {
                path: 'myAccount',
                component: MyAccountComponent,
                canActivate: [authGuard],
            }

        ]
    },


   

    {
        path: 'access-interdit',
        component: Error403Component,
    },

    {
        path: '**',
        component: Error404Component,
    },

];
