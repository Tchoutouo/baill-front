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
              component: AnnouncesComponent
            },

            {
              path: 'myAccount',
              component: MyAccountComponent
            }
        ]
    },

];
