import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatEntityName',
  standalone: true
})
export class FormatEntityNamePipe implements PipeTransform {

  transform(value: string): string {
    if(value === "title"){
      return 'Categorie';
    }

    if(value === "nbre_asage"){
      return "Nombre d'utilisation";
    }

    if(value === "created_at"){
      return "Date de création";
    }
    
     // ex : test_merci
    let newValueArraya : any = value.split("_")
    // ["test", "merci"]

    newValueArraya = newValueArraya.map((name : string)=> name.charAt(0).toUpperCase() + name.slice(1)) // cette ligne va recupereé chaque element et convertir le premier caratege en majuscule

    let newValue = newValueArraya.join(" ") // join permet de joindre les element du tableau avec un le separateur souhaité
    return newValue;
  }
}
