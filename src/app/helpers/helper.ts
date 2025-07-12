import { inject } from "@angular/core";
import { AnounceEntity } from "../models/admin/nounceEntity";
import { Category } from "../models/admin/category";
import { LocalStorageService } from "../services/admin/local-storage.service";
import { Route, Router, ROUTES } from "@angular/router";
import { AuthenticatorService } from "../services/admin/authenticator.service";

export const getSiteName = () : string =>{
    let siteName = "Bailleurnet";

    return  siteName;
}

export const getExtension = (fileName : any )=> {
    // console.log(fileName);
    var parts = fileName.name.split('.');
    return parts[parts.length - 1];
}

export const is_image = (fileName : string) => {
    var ext = getExtension(fileName) ;
    // console.log(ext);
    
    switch (ext.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
        case 'jpeg':

        return true;
    }

    return false;
}

export const getEntityPoperties = (entity: string) : Array<string> =>{

    let results : any = []
    let entityClass : any;
    
    if (entity == "anouces") {
        entityClass = new AnounceEntity()
    }

    if (entity == "categories") {
        entityClass = new Category()
    }

    if (entityClass) {
        results = Object.keys(entityClass)
    }

    return entityClass ;

}

export const isAdmin = () : any =>{

    let localStorage  = inject(LocalStorageService);
    let routes = inject(Router)

    const user = localStorage.getItem('user');

    if (user) {
        if (user.profil_code === 'SUP_ADMIN') {
            return true;
        }
        return false;
    } else {
        routes.navigate(['/admin']);
        return false;
    }

}


export const isLoggedIn = () : any =>{
     let localStorage  = inject(LocalStorageService);
    let routes = inject(Router)

    const user = localStorage.getItem('user');
    if (user) {
        return user;
    }else{
        return false;
    }
}


export const requireLogin = (): any | false => {
  const localStorage = inject(LocalStorageService);
  const router = inject(Router);

  const userJson = localStorage.getItem('user');
  const user: any | null = userJson ? JSON.parse(userJson) : null;
console.log(user);

  if (!user) {
    router.navigate(['/admin']); // redirection vers login
    return false;
  }

  return user;
};