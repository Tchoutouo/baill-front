import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimeSimple',
  standalone: true
})
export class FormatTimeSimplePipe implements PipeTransform {

  transform(value: number, type_period: string): unknown {

    let time;

    switch (type_period) {
      case 'S':
          time = value/7;
          break;
      case 'M':
          time = value/30;
          break;
      case 'A':
          time = value/360;
          break;
      default:
          console.log("Periode invalide");
    }
    return time;
  }

}
