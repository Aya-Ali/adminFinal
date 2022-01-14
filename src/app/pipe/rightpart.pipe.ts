/*
Element 1 >>> foreach >>> category.desc
Element 2 >>> foreach >>> category.shot-code
Element 3 >>> Products with sub-category == null
Element 4 >>> Products with sub-category !== null

Food>>> 
condition 1 >> category >> null
condition 2 >> check elements 3 by element 1
condition  3 >> check elements 4 by element 2


if ( product.sub-category == null) {
  check by element 1
}else {
  check by elemnt 2
}


*/














import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'rightpart'
})
export class RightpartPipe implements PipeTransform {
  GroupData: any = {
    shisha: 0,
    other: 0,
    broken: 0,
    beverage: 0,
    food: 0,
    Market: 0,
    Activities: 0,
    Security: 0,
    Laundry: 0,
    Hairdresser: 0,
    animals:0
  };
  transform(recipe: any, catgory: any, group: any): object {
    this.GroupData.shisha = 0;
    this.GroupData.other = 0;
    this.GroupData.broken = 0;
    this.GroupData.beverage = 0;
    this.GroupData.food = 0;
    this.GroupData.Market = 0;
    this.GroupData.Activities = 0;
    this.GroupData.Security = 0;
    this.GroupData.Laundry = 0;
    this.GroupData.Hairdresser = 0;
    this.GroupData.animals = 0;
    // let category = args[0];
    // let group = args[1];

    group.forEach(obj => {
      obj.sell_lines.forEach(item => {
        (
          recipe.forEach(element => {
            if (item.product_id == element.id) {

              if (element.sub_category != null) {


                let subCatgoryanimalsID = catgory?.data.filter((obj) => obj.id == environment.AnimalsCategoryAndSubCategoryId)[0].description?.split(",")
                subCatgoryanimalsID?.forEach(element2 => {
                  if (element.sub_category.id == element2) {
                    this.GroupData.animals += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })
                let subCatgoryHairdresserID = catgory?.data.filter((obj) => obj.id == environment.HairdresserCategoryAndSubCategoryId)[0].description?.split(",")
                subCatgoryHairdresserID?.forEach(element2 => {
                  if (element.sub_category.id == element2) {
                    this.GroupData.Hairdresser += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })
                let subCatgoryLaundryID = catgory?.data.filter((obj) => obj.id == environment.LaundryCategoryAndSubCategoryId)[0].description?.split(",")
                subCatgoryLaundryID?.forEach(element2 => {
                  if (element.sub_category.id == element2) {
                    this.GroupData.Laundry += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })
                let subCatgorySecurityID = catgory?.data.filter((obj) => obj.id == environment.SecurityCategoryAndSubCategoryId)[0].description?.split(",")
       
                subCatgorySecurityID?.forEach(element2 => {
                  if (element.sub_category.id == element2) {
                   
                    this.GroupData.Security += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })
                let subCatgoryActivitiesID = catgory?.data.filter((obj) => obj.id == environment.ActivitiesCategoryAndSubCategoryId)[0].description?.split(",")
                subCatgoryActivitiesID?.forEach(element2 => {
                  if (element.sub_category.id == element2) {
                    this.GroupData.Activities += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })
                let subCatgoryMarketID = catgory?.data.filter((obj) => obj.id == environment.MarketCategoryAndSubCategoryId)[0].description?.split(",")
                subCatgoryMarketID?.forEach(element2 => {
                  if (element.sub_category.id == element2) {
                    this.GroupData.Market += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })
                let subCatgoryotherID = catgory?.data.filter((obj) => obj.id == environment.otherCategoryAndSubCategoryId)[0].description?.split(",")
   
                subCatgoryotherID?.forEach(element2 => {
                
                  if (element.sub_category.id == element2) {
                    this.GroupData.other += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })
                let subCatgoryshishaID = catgory?.data.filter((obj) => obj.id == environment.shishaCategoryAndSubCategoryId)[0].description?.split(",")
                subCatgoryshishaID?.forEach(element2 => {
                  if (element.sub_category.id == element2) {
                    this.GroupData.shisha += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })

                let subCatgorybrokenID = catgory?.data.filter((obj) => obj.id == environment.brokenCategoryAndSubCategoryId)[0].description?.split(",")
                subCatgorybrokenID?.forEach(element2 => {
                  if (element.sub_category.id == element2) {
                    this.GroupData.broken += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })


                let subCatgorybeverageID = catgory?.data.filter((obj) => obj.id == environment.beverageCategoryAndSubCategoryId)[0].description?.split(",")
                subCatgorybeverageID?.forEach(element2 => {
                  if (element.sub_category.id == element2) {
                    this.GroupData.beverage += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })

                let subCatgoryfoodID = catgory?.data.filter((obj) => obj.id == environment.foodCategoryAndSubCategoryId)[0].description?.split(",");

                subCatgoryfoodID?.forEach(element2 => {
                  if (element.sub_category.id == element2) {

                    this.GroupData.food += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                });

              }

              else if (element.sub_category == null && element.category != null) {

                let catgoryAnimalsID = catgory?.data.filter((obj) => obj.id == environment.AnimalsCategoryAndSubCategoryId)[0].description?.split(",")
                catgoryAnimalsID?.forEach(element2 => {
                  if (element.category.id == element2) {
                    this.GroupData.animals += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })

                let catgoryHairdresserID = catgory?.data.filter((obj) => obj.id == environment.HairdresserCategoryAndSubCategoryId)[0].description?.split(",")
                catgoryHairdresserID?.forEach(element2 => {
                  if (element.category.id == element2) {
                    this.GroupData.Hairdresser += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })
                let catgoryLaundryID = catgory?.data.filter((obj) => obj.id == environment.LaundryCategoryAndSubCategoryId)[0].description?.split(",")
                catgoryLaundryID?.forEach(element2 => {
                  if (element.category.id == element2) {
                    this.GroupData.Laundry += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })
                let catgorySecurityID = catgory?.data.filter((obj) => obj.id == environment.SecurityCategoryAndSubCategoryId)[0].description?.split(",")
        
                catgorySecurityID?.forEach(element2 => {
                  if (element.category.id == element2) {
                    this.GroupData.Security += Number((item.quantity - item.quantity_returned) * item.unit_price)

                  }
                })
                let catgoryActivitiesID = catgory?.data.filter((obj) => obj.id == environment.ActivitiesCategoryAndSubCategoryId)[0].description?.split(",")
                catgoryActivitiesID?.forEach(element2 => {
                  if (element.category.id == element2) {
                    this.GroupData.Activities += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })
                let catgoryMarketID = catgory?.data.filter((obj) => obj.id == environment.MarketCategoryAndSubCategoryId)[0].description?.split(",")
                catgoryMarketID?.forEach(element2 => {
                  if (element.category.id == element2) {
                    this.GroupData.Market += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })
                let catgoryotherID = catgory?.data.filter((obj) => obj.id == environment.otherCategoryAndSubCategoryId)[0].description?.split(",")

                catgoryotherID?.forEach(element2 => {
                  if (element.category.id == element2) {
                    this.GroupData.other += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })
                let catgoryshishaID = catgory?.data.filter((obj) => obj.id == environment.shishaCategoryAndSubCategoryId)[0].description?.split(",")
                catgoryshishaID?.forEach(element2 => {
                  if (element.category.id == element2) {
                    this.GroupData.shisha += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })

                let catgorybrokenID = catgory?.data.filter((obj) => obj.id == environment.brokenCategoryAndSubCategoryId)[0].description?.split(",")
                catgorybrokenID?.forEach(element2 => {
                  if (element.category.id == element2) {
                    this.GroupData.broken += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })


                let catgorybeverageID = catgory?.data.filter((obj) => obj.id == environment.beverageCategoryAndSubCategoryId)[0].description?.split(",")
                catgorybeverageID?.forEach(element2 => {
                  if (element.category.id == element2) {
                    this.GroupData.beverage += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                })

                let catgoryfoodID = catgory?.data.filter((obj) => obj.id == environment.foodCategoryAndSubCategoryId)[0].description?.split(",");

                catgoryfoodID?.forEach(element2 => {

                  if (element.category.id == element2) {

                    this.GroupData.food += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  }
                });


              }
              else if (element.category == null) {
                this.GroupData.food += Number((item.quantity - item.quantity_returned) * item.unit_price)
              }

            }
          })
        )
      })
    });
    return this.GroupData;
  }
}