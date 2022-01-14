import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {

  transform(group: any, sumStock?: any): any {

    let sum: number = 0;
    if (sumStock != undefined) {
      group.forEach(element => {
        sum += Number(element[sumStock])
      });
      return sum
    }
    else {
      sum = group.reduce((sum, x) => {
        return (sum + x)
      }
      )
      return sum.toFixed(2);
    }

  }

}
