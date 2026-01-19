import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
  standalone: true
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number, type_period: string): unknown {

    let time;

    switch (type_period) {
      case 'S':
          time = value/7;
          time = time + ' ' + ' semaine(s)';
          break;
      case 'M':
          time = value/30;
          time = time + ' ' + ' mois';
          break;
      case 'A':
          time = value/360;
          time = time + ' ' + ' année(s)';
          break;
      case 'H':
          time = value;
          time = time + ' ' + ' heure(s)';
          break;
      default:
          console.log("Periode invalide");
    }
    return time;
  }

}
