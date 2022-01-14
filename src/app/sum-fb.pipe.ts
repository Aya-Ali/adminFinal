import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumFb'
})
export class SumFbPipe implements PipeTransform {
  TotalSum = {
    totalProductSum: 0,
    totalSellSum: 0,
    totalProfitSum: 0,
    totalStock: 0,
    totalCostProduct: 0,
    totalCostSell: 0,
    quantity: 0,
  }
  transform(recipes: any, orderQuantity: any): any {
    this.TotalSum.totalProductSum = 0;
    this.TotalSum.totalSellSum = 0;
    this.TotalSum.totalProfitSum = 0;
    this.TotalSum.totalStock = 0;
    this.TotalSum.totalCostProduct = 0;
    this.TotalSum.totalCostSell = 0;
    this.TotalSum.quantity = 0;
    if (orderQuantity != 'qty_available') {

      orderQuantity.forEach(item => {

        let dpp = 0
        recipes.forEach((obj) => {
          if (obj.id == item.id) {
            dpp = obj.product_variations[0].variations.filter((obj2) => obj2.id == item.variation_id)
          }
        })
        this.TotalSum.quantity += item.qunt;
        this.TotalSum.totalProductSum += (item.qunt * dpp[0].dpp_inc_tax)
        this.TotalSum.totalSellSum += (item.avgUnit_price)
      });
      // (item.qunt*(allRecipe|filterRecipe:item.id)?.product_variations[0].variations[0].default_sell_price)
    }
    else {
      recipes.forEach(element => {
        element.product_variations[0].variations.forEach(element2 => {
          let Stocks = 0;
          if (element.category != null&& element.enable_stock != 0 && element2.variation_location_details.length > 0) {
            element2.variation_location_details.forEach(element3 => {
              this.TotalSum.totalStock += Number(element3.qty_available);
              Stocks += Number(element3.qty_available)
            });
          }

          this.TotalSum.totalProductSum += Number(element2.dpp_inc_tax)
          this.TotalSum.totalCostProduct += (Number(element2.dpp_inc_tax) * Stocks)
          this.TotalSum.totalSellSum += Number(element2.default_sell_price)
          this.TotalSum.totalCostSell += (Number(element2.default_sell_price) * Stocks)
        });
      });
    }
    this.TotalSum.totalProfitSum = this.TotalSum.totalSellSum - this.TotalSum.totalProductSum;
    return this.TotalSum;
  }
}
