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

export const routes: Routes = [
    { 
        path: '', 
        component: MainComponent 
    },
    { 
        path: 'admin/announces/create', 
        component: FormCreateComponent 
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
        path: 'product-details', 
        component: ProductDetailsComponent 
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
                pathMatch: 'full' 
            },
            
            {
              path: 'dashboard',
              component: DashboardComponent
            },

            {
              path: 'settings',
              component: SettingsComponent
            },
            {
                path: 'announces',
                component: AnnouceIndexComponent,
                children: [
                    

                    { 
                        path: 'create',
                        component: FormCreateComponent,
                        pathMatch: 'full' 
                    },
                    
                    { 
                        path: 'announces-list',
                        component: AnnouncesComponent,
                    },
                ]
            },

        ]
    },

    {
      path: 'myAccount',
      component: MyAccountComponent,
        canActivate: [authGuard],
    }

];
