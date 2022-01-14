import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableName'
})
export class TableNamePipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/[0-9 ]/g, '').toLowerCase();
  }

}
