import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(sell: any): any {
    if (sell != undefined) {


      let date = new Date();
      let time = date.toLocaleString('en', { timeZone: 'Africa/Cairo' });
      let currentTime = 0;
      let Result = false;
      if (sell.shipping_status == null && sell.delivered_to == null) {
        currentTime = Math.round(
          (new Date(time).getTime() - new Date(sell.transaction_date).getTime()) / 60000
        );
        if (currentTime >= 20) {
          Result = true;
        }
      } else if (sell.shipping_status == 'ordered' && sell.delivered_to == null) {
        currentTime = Math.round(
          (new Date(time).getTime() - new Date(sell.updated_at).getTime()) / 60000
        );
        if (currentTime >= 20) {
          Result = true;
        }
      } else if (sell.delivered_to != null) {
        if (sell.delivered_to.lastIndexOf('@') != -1) {
          let customTime = sell.delivered_to.slice(
            sell.delivered_to.lastIndexOf('@') + 1
          );
          let current1 = 0;
          let current2 = 0;
          current1 = Math.round(
            (new Date(time).getTime() - new Date(customTime).getTime()) / 60000
          );
          current2 = Math.round(
            (new Date(customTime).getTime() - new Date(sell.transaction_date).getTime()) /
            60000
          );
          if (sell.shipping_status != 'delivered') {
            if (current1 >= 20 || current2 >= 20) {
              Result = true;
            }
          } else {
            if (current2 >= 20) {
              Result = true;
            }
          }
        }
      }
      return Result;
    }
  }
}
