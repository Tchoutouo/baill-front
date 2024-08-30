import { Routes } from '@angular/router';
import { SigninComponent } from './components/auth/signin/signin.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { MainComponent } from './components/user/main/main.component';
import { ProductListComponent } from './components/user/product-list/product-list.component';
import { ProductDetailsComponent } from './components/user/product-details/product-details.component';

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
];
