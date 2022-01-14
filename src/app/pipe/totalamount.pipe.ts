import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'totalamount'
})
export class TotalamountPipe implements PipeTransform {
  // Start Calculate Total Amount & Discount

  Group: any = {
    totalGroup: 0,
    discountGroup: 0,
    service15Group: 0,
    service10Group: 0
  }
  transform(group: any): any {
    this.Group.totalGroup=0;
    this.Group.discountGroup=0;
    this.Group.service15Group=0;
    this.Group.service10Group=0;
    group.forEach(element => {
      this.Group.totalGroup += Number(element.final_total)
      this.Group.discountGroup +=
        element.discount_type == 'fixed'
          ? Number(element.discount_amount)
          : Number(element.discount_amount) != 0
            ? Number(element.total_before_tax) *
            Number(element.discount_amount / 100)
            : Number(element.discount_amount);

      if (element.tax_id == environment.service15) {
        this.Group.service15Group += Number(element.tax_amount)
      }
      else if (element.tax_id == environment.service25) {
        this.Group.service15Group += (0.6 * Number(element.tax_amount))
        this.Group.service10Group += (0.4 * Number(element.tax_amount))
      }
    });
    return this.Group;
  }

}
