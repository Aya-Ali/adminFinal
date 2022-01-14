import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'officer'
})
export class OfficerPipe implements PipeTransform {

  transform(value: any): any {
    if (value != null) {
      return value;
    }
    else {
      return 0
    }

  }

}
