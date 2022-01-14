import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeKitchen'
})
export class TimeKitchenPipe implements PipeTransform {
  userName: string = "";
  constructor(public datepipe: DatePipe) {
    this.userName = localStorage.getItem("userMobile")
  }
  transform(timeEvent: any, type, userName?): string {

    if (type == "kitchen") {
      let time = new Date();
      let date = time.toLocaleString('en', { timeZone: 'Africa/Cairo' });
      let todayTime = this.datepipe.transform(date, 'yyyy-MM-dd');
      let timeEvent2 = this.datepipe.transform(timeEvent, 'yyyy-MM-dd');
      let yasterday = new Date(date).setDate(new Date(date).getDate() + 1);
      let yasterdayEvent = this.datepipe.transform(yasterday, 'yyyy-MM-dd');
      if (timeEvent2 == todayTime) {
        return 'danger'
      }
      else if (timeEvent2 == yasterdayEvent) {
        return 'warning'
      }
      else {
        return 'success'
      }
    }
    else if (type == 'kitchen2') {
      if (timeEvent.delivered_to != null) {
        let delivered_to = JSON.parse(timeEvent.delivered_to);

        let index = delivered_to.findIndex((obj) => userName == obj.name)
        // for (let i = 0; i < delivered_to.length; i++) {
        if (index != -1) {
          let checkedTime = new Date(delivered_to[index].time);
          let updated_at = new Date(timeEvent.sell_lines[0].updated_at);
          if ((checkedTime.getTime() - updated_at.getTime()) < 0) {
            return "success"
          }
          else {
            return "danger"
          }
        }
        else {
          return "success"
        }
        // }

      } else {
        return "success"
      }

    }
  }
}
