import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCash'
})
export class FilterCashPipe implements PipeTransform {

  transform(paymants: any, type: string): any {
    return paymants.findIndex((index)=> index.type == type)
  }

}
