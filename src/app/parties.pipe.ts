import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharedService } from './dataShared';
@Pipe({
  name: 'parties'
})
export class PartiesPipe implements PipeTransform {
  GroupData: any = {
    beverage: 0,
    food: 0,
    // taxOfFoodAndBeverage: 0,
    depreciation: 0,
    rental: 0,
    SupplementaryFund: 0,
    X: 0, //Difference between rental value and depreciation and supplementary fund
    service15: 0,
    Wedding: 0,
    weddingSupplier: 0,
    videoPhotos: 0,
    videoPhotosSupplier: 0,
    laser: 0,
    Dj: 0,
    Smoking: 0,
    laserSupplier: 0,
    DjSupplier: 0,
    SmokingSupplier: 0,
    laserDjSmoking: 0,
    laserDjSmokinglaserDjSmokingSupplier: 0,
    weddingDesigner: 0,
    weddingDesignerSupplier: 0,
    partiesRatio_2: 0,
    partiesRatio_3: 0,
    finalTax15: 0,
    Screens: 0,
    Sounds: 0,
    Lights: 0,
    totalScreens: 0,
    totalSound: 0,
    totalLights: 0,
    Maintenance: 0,
    total_maintenance: 0,
    ExternalPurchases: 0,
    Security: 0,
    Tips: 0,
    HallOpeningFees: 0,
    covers: 0,
    total: 0,
    totalSupplier: 0,
    totalFood: 0,
    cash: 0,
    card: 0,
    custom_pay_1: 0,
    TotalPayments1_11: 0,
    armed_force_discount_amount: 0,
    final_total: 0,
    id: 0,
  };


  transform(recipe: any, catgory: any, sell: any, table: any, taxs: any): object {
    this.GroupData.beverage = 0;
    this.GroupData.food = 0;
    // this.GroupData.taxOfFoodAndBeverage = 0
    this.GroupData.depreciation = 0;
    this.GroupData.rental = 0;
    this.GroupData.SupplementaryFund = 0;
    this.GroupData.X = 0;
    this.GroupData.service15 = 0;
    this.GroupData.Wedding = 0;
    this.GroupData.weddingSupplier = 0;
    this.GroupData.videoPhotos = 0;
    this.GroupData.videoPhotosSupplier = 0;
    this.GroupData.laser = 0;
    this.GroupData.Dj = 0;
    this.GroupData.Smoking = 0;
    this.GroupData.laserDjSmoking = 0;
    this.GroupData.laserSupplier = 0;
    this.GroupData.DjSupplier = 0;
    this.GroupData.SmokingSupplier = 0;
    this.GroupData.laserDjSmokingSupplier = 0;
    this.GroupData.weddingDesigner = 0;
    this.GroupData.weddingDesignerSupplier = 0;
    this.GroupData.partiesRatio_2 = 0;
    this.GroupData.partiesRatio_3 = 0;
    this.GroupData.finalTax15 = 0;
    this.GroupData.Lights = 0;
    this.GroupData.Sounds = 0;
    this.GroupData.Screens = 0;
    this.GroupData.Security = 0;
    this.GroupData.Maintenance = 0;
    this.GroupData.total_maintenance = 0;
    this.GroupData.ExternalPurchases = 0;
    this.GroupData.Tips = 0;
    this.GroupData.covers = 0;
    this.GroupData.totalScreens = 0;
    this.GroupData.totalSound = 0;
    this.GroupData.totalLights = 0;
    this.GroupData.HallOpeningFees = 0;
    this.GroupData.cash = 0;
    this.GroupData.card = 0;
    this.GroupData.custom_pay_1 = 0;
    this.GroupData.TotalPayments1_11 = 0;
    this.GroupData.armed_force_discount_amount = 0;
    this.GroupData.total = 0;
    this.GroupData.totalSupplier = 0;
    this.GroupData.final_total = 0;
    this.GroupData.id = 0;
    // this.GroupData.totalFood = 0;
    let taxOfFoodAndBeverage = 0;
    let TotalBuffetCombo = 0;
    // let weddingArr = [];
    let dJRatio_3 = 0;
    let lights = 0;
    let sound = 0;
    let laserValue = 0;
    let laserValueSupplier = 0;
    let screens = 0;
    let smoking = 0;
    let smokingSupplier = 0;
    let cover = 0;
    let total_service_food_and_beverage = 0;
    let total_foodBeverage_in_combo = 0;

    // let total_laser_dj_smoking_subca+tegories=0;
    // let total_laser_dj_smoking_categories=0;
    // let catgoryComboID = catgory?.data.filter((obj) => obj.id == environment.comboProductCategory);
    // var varationArr = [];
    let tax = taxs?.filter((obj) => obj.id == environment.service15)[0].amount;
    let taxsCalc2 = (item) => {
      taxOfFoodAndBeverage = (this.GroupData.food + this.GroupData.beverage) * (Number(tax) / 100);
    }
    sell.sell_lines?.forEach(item => {
      (
        recipe.forEach(element => {
          if (item.children_type == "combo" && element.product_variations[0].variations[0].id == item.variation_id) {
            total_foodBeverage_in_combo += Number((item.quantity - item.quantity_returned) * (element.product_variations[0].variations[0].default_sell_price))

            total_service_food_and_beverage = total_foodBeverage_in_combo * (Number(tax) / 100);
          }
          if (item.product_id == element.id && element.category?.id == environment.comboProductCategory) {
            TotalBuffetCombo += Number((item.quantity - item.quantity_returned) * item.unit_price_inc_tax);
          }
          if (item.product_id == element.id && element.category?.id != environment.comboProductCategory) {
            if (element.sub_category == null && element.category != null) {
              // Beverage Calculation
              let catgorybeverageID = catgory?.data.filter((obj) => obj.id == environment.beverageCategoryAndSubCategoryId)[0]?.description?.split(",")
              catgorybeverageID?.forEach(element2 => {
                if (element.category.id == element2) {
                  this.GroupData.beverage += Number((item.quantity - item.quantity_returned) * (element.product_variations[0].variations[0].default_sell_price));
                  // taxOfFoodAndBeverage+= this.GroupData.beverage *0.15
                  taxsCalc2(item);
                }
              })

              // End Beverage Calculation
              // Food Calculation
              let catgoryfoodID = catgory?.data.filter((obj) => obj.id == environment.foodCategoryAndSubCategoryId)[0]?.description?.split(",");

              catgoryfoodID?.forEach(element2 => {

                if (element.category.id == element2) {
                  this.GroupData.food += Number((item.quantity - item.quantity_returned) * (element.product_variations[0].variations[0].default_sell_price));
                  taxsCalc2(item);

                }
              });

              // End Food Calculation
              // Rental , Depreciation And Supplementary Fund Calculation

              let CatgorydepreciationID = catgory?.data.filter((obj) => obj.id == environment.partiesRentalCategoryAndSubcategoryID)[0]?.description?.split(",")

              CatgorydepreciationID?.forEach(element2 => {
                // hsbat 15%
                if (element.category.id == element2) {
                  let D = Number(catgory?.data.filter((obj) => obj.id == environment.depreciation)[0]?.description);   //Depreciation
                  let S = Number(catgory?.data.filter((obj) => obj.id == environment.SupplementaryFund)[0]?.description);   //SupplementaryFund
                  let R = 0;
                  R += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  if ((R - D - S) >= 0) {
                    D = Number(catgory?.data.filter((obj) => obj.id == environment.depreciation)[0]?.description);
                    S = Number(catgory?.data.filter((obj) => obj.id == environment.SupplementaryFund)[0]?.description);
                    this.GroupData.rental = R - (D + S);
                    this.GroupData.depreciation = D;
                    this.GroupData.SupplementaryFund = S;
                  }
                  else if ((R >= D) && ((R - D) < S)) {
                    D = Number(catgory?.data.filter((obj) => obj.id == environment.depreciation)[0]?.description);
                    S = Number(catgory?.data.filter((obj) => obj.id == environment.SupplementaryFund)[0]?.description);
                    this.GroupData.X = R - D - S;
                    R = R - (D + S) - this.GroupData.X;
                    this.GroupData.rental = R;
                    this.GroupData.depreciation = D;
                    this.GroupData.SupplementaryFund = S;
                  }
                  else if (R < D) {
                    D = Number(catgory?.data.filter((obj) => obj.id == environment.depreciation)[0]?.description);
                    S = Number(catgory?.data.filter((obj) => obj.id == environment.SupplementaryFund)[0]?.description);
                    this.GroupData.X = R - D - S;
                    R = R - (D + S) - this.GroupData.X;
                    this.GroupData.rental = R;
                    this.GroupData.depreciation = D;
                    this.GroupData.SupplementaryFund = S;
                  }

                }
              });
              // End Rental , Depreciation And Supplementary Fund Calculation

              // wedding
              let weddingRatio_2 = 0;
              let weddingRatio_3 = 0;
              let weddingCalculationsRatios = catgory?.data?.filter((obj) => obj.id == environment.weddingCalculationsRatios)[0]?.description?.split(",");

              let weddingCalculationsCategoriesSubCategories = catgory.data.filter((obj) => obj.id == environment.weddingCalculationsCategoriesSubCategories)[0]?.description?.split(",")

              let weddingCalculations = 0
              for (var i = 0; i < weddingCalculationsRatios?.length; i++) {
                let Ratios = weddingCalculationsRatios[i];

                // let weddingID = catgory?.data?.filter((obj) => obj.id == weddingCalculationsCategoriesSubCategories[i])[0]?.description;
                if (weddingCalculationsCategoriesSubCategories[i] != undefined && element.category.id == weddingCalculationsCategoriesSubCategories[i]) {

                  weddingCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)

                  this.GroupData.Wedding += (Number(Ratios) *
                    (
                      weddingCalculations - ((Number(catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_2)[0]?.description) + Number(catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_3)[0]?.description)) * weddingCalculations)
                    )
                  )
                  this.GroupData.weddingSupplier += (Number(1 - Ratios) *
                    (
                      weddingCalculations - ((Number(catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_2)[0]?.description) + Number(catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_3)[0]?.description)) * weddingCalculations)
                    )
                  )
                }

              }

              // end wedding


              // video&Photo
              let videoPhotosCalculationsRatios = catgory?.data?.filter((obj) => obj.id == environment.videoPhotosCalculationsRatios)[0]?.description?.split(",");
              let videoPhotosCalculationsCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.videoPhotosCalculationsCategoriesSubCategories)[0]?.description?.split(",");
              let videoPhotosCalculations = 0
              for (var i = 0; i < videoPhotosCalculationsRatios?.length; i++) {
                let Ratios = videoPhotosCalculationsRatios[i];
                if (videoPhotosCalculationsCategoriesSubCategories[i] != undefined) {

                  if (element.category.id == videoPhotosCalculationsCategoriesSubCategories[i]) {

                    videoPhotosCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                    this.GroupData.videoPhotos += (Ratios * videoPhotosCalculations);
                    this.GroupData.videoPhotosSupplier += ((1 - Ratios) * videoPhotosCalculations)
                  }

                }
              }

              //end video&photo

              // weddingDesigner
              let weddingDesignerCalculationsRatios = catgory?.data?.filter((obj) => obj.id == environment.weddingDesignerCalculationsRatios)[0]?.description?.split(",");

              let weddingDesignerCalculationsCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.weddingDesignerCalculationsCategoriesSubCategories)[0]?.description?.split(",");


              let weddingDesignerCalculations = 0
              for (var i = 0; i < weddingDesignerCalculationsRatios?.length; i++) {
                let Ratios = weddingDesignerCalculationsRatios[i]

                if (weddingDesignerCalculationsCategoriesSubCategories[i] != undefined) {

                  if (element.category.id == weddingDesignerCalculationsCategoriesSubCategories[i]) {
                    weddingDesignerCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                    this.GroupData.weddingDesigner += (Ratios * weddingDesignerCalculations)
                    this.GroupData.weddingDesignerSupplier += ((1 - Ratios) * weddingDesignerCalculations)
                  }

                }


              }
              //end weddingDesigner



              // fixedItemValues
              let fixedItemValuesCalculations = JSON.parse(catgory?.data?.filter((obj) => obj.id == environment.fixedItemValues)[0]?.description);
              let lights_open = fixedItemValuesCalculations[0]?.lights_open;
              let lights_close = fixedItemValuesCalculations[0]?.lights_close;
              let screens_open = fixedItemValuesCalculations[0]?.screens_open;
              let screens_close = fixedItemValuesCalculations[0]?.screens_close;
              let smoking_open = fixedItemValuesCalculations[0]?.smoking_open;
              let smoking_close = fixedItemValuesCalculations[0]?.smoking_close;
              let laser_open = fixedItemValuesCalculations[0]?.laser_open;
              let laser_close = fixedItemValuesCalculations[0]?.laser_close;
              let sound_open = fixedItemValuesCalculations[0]?.sound_open;
              let sound_close = fixedItemValuesCalculations[0]?.sound_close;
              let cover_open = fixedItemValuesCalculations[0]?.cover_open;
              let cover_close = fixedItemValuesCalculations[0]?.cover_close;
              let fixedItemValuesRatios = JSON.parse(catgory?.data?.filter((obj) => obj.id == environment.FixedItemsRatios)[0]?.description);
              let lights_open_Ration = fixedItemValuesRatios[0]?.lights_open;
              let lights_close_Ration = fixedItemValuesRatios[0]?.lights_close;
              let screens_open_Ration = fixedItemValuesRatios[0]?.screens_open;
              let screens_close_Ration = fixedItemValuesRatios[0]?.screens_close;
              let smoking_open_Ration = fixedItemValuesRatios[0]?.smoking_open;
              let smoking_close_Ration = fixedItemValuesRatios[0]?.smoking_close;
              let laser_open_Ration = fixedItemValuesRatios[0]?.laser_open;
              let laser_close_Ration = fixedItemValuesRatios[0]?.laser_close;
              let sound_open_Ration = fixedItemValuesRatios[0]?.sound_open;
              let sound_close_Ration = fixedItemValuesRatios[0]?.sound_close;
              let cover_open_Ration = fixedItemValuesRatios[0]?.cover_open;
              let cover_close_Ration = fixedItemValuesRatios[0]?.cover_close;
              // let maintenance_open = fixedItemValuesCalculations[0].maintenance_open;
              // let maintenance_close = fixedItemValuesCalculations[0].maintenance_close;
              let maintenance = 0;
              let qualntity = sell.custom_field_1;
              var tableRes = table.filter((obj) => obj.id == sell.res_table_id)[0]?.description
              let status = (tableRes != undefined) ? JSON.parse(tableRes)[0].status : ''; //table.describtion(index 0)

              // let laser_ratio_Ids = catgory?.data?.filter((obj) => obj.id == environment.laserCalculationsRatios)[0]?.description?.split(",");
              // let laser_close_ratio = catgory?.data?.filter((obj) => obj.id == laser_ratio_Ids[0])[0]?.description  // 0.85 // laserDJSmokingCalculationsRatios.describtion(index 0)?.description
              // let laser_open_ratio = catgory?.data?.filter((obj) => obj.id == laser_ratio_Ids[1])[0]?.description // laserDJSmokingCalculationsRatios.describtion(index 1)?.description
              // if (item.children_type == "combo" && element.product_variations[0].variations[0].id == item.variation_id) {
              //   total_foodBeverage_in_combo= Number((item.quantity - item.quantity_returned) * (element.product_variations[0].variations[0].default_sell_price))
              //   total_service_food_and_beverage = total_foodBeverage_in_combo * (Number(tax) / 100);
              // }

              let ExtraBuffetMoney = TotalBuffetCombo - (total_foodBeverage_in_combo + total_service_food_and_beverage); // Total Buffet - (food + beverage +15% of food and beverage)
              let buffet = ExtraBuffetMoney; // Total Buffet - (food + beverage +15% of food and beverage)

              if (sell.shipping_status != "cancelled") {
                if (status == "open") {
                  lights = lights_open * lights_open_Ration;
                  sound = sound_open * sound_open_Ration;
                  laserValue = laser_open * laser_open_Ration;
                  laserValueSupplier = laser_open * (1 - laser_open_Ration);
                  screens = screens_open * screens_open_Ration;
                  smoking = smoking_open * smoking_open_Ration;
                  smokingSupplier = smoking_open * (1 - smoking_open_Ration);
                  this.GroupData.covers = cover_open * cover_open_Ration * qualntity;
                  maintenance = buffet - (lights + screens + smoking + laserValue + sound + this.GroupData.covers); // Will be added to maintenance
                }

                else if (status == "close") {
                  lights = lights_close * lights_close_Ration;
                  sound = sound_close * sound_close_Ration;
                  laserValue = laser_close * laser_close_Ration;
                  laserValueSupplier = laser_close * (1 - laser_close_Ration);
                  screens = screens_close * screens_close_Ration;
                  smoking = smoking_close * smoking_close_Ration;
                  smokingSupplier = smoking_close * (1 - smoking_close_Ration);
                  this.GroupData.covers = cover_close * cover_close_Ration * qualntity;
                  maintenance = buffet - (lights + screens + smoking + laserValue + sound + this.GroupData.covers); // Will be added to maintenance

                }
              }



              //end fixedItemValues
              // laser

              let laserCalculationsRatios = catgory?.data?.filter((obj) => obj.id == environment.laserCalculationsRatios)[0]?.description?.split(",");

              let laserCalculationsCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.laserCalculationsCategoriesSubCategories)[0]?.description?.split(",")

              let laserCalculations = 0
              for (var i = 0; i < laserCalculationsRatios?.length; i++) {
                let Ratios = laserCalculationsRatios[i];

                if (laserCalculationsCategoriesSubCategories[i] != undefined && element.category.id == laserCalculationsCategoriesSubCategories[i]) {
                  laserCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.laser += (Ratios * laserCalculations)
                  this.GroupData.laserSupplier += ((1 - Ratios) * laserCalculations)
                }
              }
              //end laser
              // DJ
              let DJCalculationsRatios = catgory?.data?.filter((obj) => obj.id == environment.DJCalculationsRatios)[0]?.description?.split(",");

              let DJCalculationsCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.DJCalculationsCategoriesSubCategories)[0]?.description?.split(",")

              let DJCalculations = 0
              for (var i = 0; i < DJCalculationsRatios?.length; i++) {

                let Ratios = DJCalculationsRatios[i];

                if (DJCalculationsCategoriesSubCategories[i] != undefined && element.category.id == DJCalculationsCategoriesSubCategories[i]) {
                  DJCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Dj += (Ratios) * (DJCalculations - (catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_3)[0]?.description) * (DJCalculations))
                  this.GroupData.DjSupplier += (1 - Ratios) * (DJCalculations - (catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_3)[0]?.description) * (DJCalculations))
                }
              }

              //end DJ
              // Smoking
              let SmokingCalculationsRatios = catgory?.data?.filter((obj) => obj.id == environment.SmokingCalculationsRatios)[0]?.description?.split(",");

              let SmokingCalculationsCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.SmokingCalculationsCategoriesSubCategories)[0]?.description?.split(",")

              let SmokingCalculations = 0
              for (var i = 0; i < SmokingCalculationsRatios?.length; i++) {
                let Ratios = SmokingCalculationsRatios[i];
                if (SmokingCalculationsCategoriesSubCategories[i] != undefined && element.category.id == SmokingCalculationsCategoriesSubCategories[i]) {
                  SmokingCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Smoking += (Ratios * SmokingCalculations)
                  this.GroupData.SmokingSupplier += ((1 - Ratios) * SmokingCalculations)
                }
              }
              //end Smoking
              // Calculate Wedding 2% And 3 %
              this.GroupData.partiesRatio_2 += (catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_2)[0]?.description) * weddingCalculations;
              weddingRatio_2 = this.GroupData.partiesRatio_2;
              weddingRatio_3 = (catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_3)[0]?.description) * (weddingCalculations)
              dJRatio_3 = (catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_3)[0]?.description) * (DJCalculations)
              this.GroupData.partiesRatio_3 += weddingRatio_3 + dJRatio_3
              // // End Calculate Wedding 2% And 3 %


              let PartiesLightsCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesLightsCalculationRatio)[0]?.description?.split(",");

              let PartiesFixedItemsLightsCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesFixedItemsLightsCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let LightsCalculations = 0
              for (var i = 0; i < PartiesLightsCalculationRatio?.length; i++) {
                let Ratios = PartiesLightsCalculationRatio[i];


                if (PartiesFixedItemsLightsCalculationCategoriesSubCategories[i] != undefined && element.category.id == PartiesFixedItemsLightsCalculationCategoriesSubCategories[i]) {
                  LightsCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Lights += (Ratios * LightsCalculations)
                }
              }
              //End Lights

              // Sounds
              let PartiesSoundsCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesSoundsCalculationRatio)[0]?.description?.split(",");

              let PartiesFixedItemsSoundsCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesFixedItemsSoundsCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let SoundsCalculations = 0
              for (var i = 0; i < PartiesSoundsCalculationRatio?.length; i++) {
                let Ratios = PartiesSoundsCalculationRatio[i];

                if (PartiesFixedItemsSoundsCalculationCategoriesSubCategories[i] != undefined && element.category.id == PartiesFixedItemsSoundsCalculationCategoriesSubCategories[i]) {
                  SoundsCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Sounds += (Ratios * SoundsCalculations)

                }
              }
              //End Sounds

              // Screens
              let PartiesScreensCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesScreensCalculationRatio)[0]?.description?.split(",");

              let PartiesFixedItemsScreensCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesFixedItemsScreensCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let ScreensCalculations = 0
              for (var i = 0; i < PartiesScreensCalculationRatio?.length; i++) {
                let Ratios = PartiesScreensCalculationRatio[i];

                if (PartiesFixedItemsScreensCalculationCategoriesSubCategories[i] != undefined && element.category.id == PartiesFixedItemsScreensCalculationCategoriesSubCategories[i]) {
                  ScreensCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Screens += (Ratios * ScreensCalculations)
                }
              }
              //End Screens

              // Hall Opening Fees

              let PartiesHallopeningfeesCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesHallopeningfeesCalculationRatio)[0]?.description?.split(",");

              let PartiesHallopeningfeesCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesHallopeningfeesCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let HallOpeningFeesCalculations = 0
              for (var i = 0; i < PartiesHallopeningfeesCalculationRatio?.length; i++) {
                let Ratios = PartiesHallopeningfeesCalculationRatio[i];

                if (PartiesHallopeningfeesCalculationCategoriesSubCategories[i] != undefined && element.category.id == PartiesHallopeningfeesCalculationCategoriesSubCategories[i]) {

                  HallOpeningFeesCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.HallOpeningFees += (Ratios * HallOpeningFeesCalculations)
                }
              }
              //End Hall Opening Fees

              // External Purchases
              let PartiesExternalPurchasesCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesExternalPurchasesCalculationRatio)[0]?.description?.split(",");

              let PartiesExternalPurchasesCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesExternalPurchasesCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let ExternalPurchasesCalculations = 0
              for (var i = 0; i < PartiesExternalPurchasesCalculationRatio?.length; i++) {
                let Ratios = PartiesExternalPurchasesCalculationRatio[i];

                if (PartiesExternalPurchasesCalculationCategoriesSubCategories != undefined && element.category.id == PartiesExternalPurchasesCalculationCategoriesSubCategories[i]) {
                  ExternalPurchasesCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.ExternalPurchases += (Ratios * ExternalPurchasesCalculations)
                }
              }
              //End External Purchases

              // Maintenance
              let PartiesMaintenanceCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesMaintenanceCalculationRatio)[0]?.description?.split(",");

              let PartiesMaintenanceCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesMaintenanceCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let MaintenanceCalculations = 0
              for (var i = 0; i < PartiesMaintenanceCalculationRatio?.length; i++) {
                let Ratios = PartiesMaintenanceCalculationRatio[i];

                if (PartiesMaintenanceCalculationCategoriesSubCategories != undefined && element.category.id == PartiesMaintenanceCalculationCategoriesSubCategories[i]) {

                  MaintenanceCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Maintenance += (Ratios * MaintenanceCalculations)
                }
              }
              //End Maintenance

              // Security
              let PartiesParkingCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesParkingCalculationRatio)[0]?.description?.split(",");

              let PartiesSecurityCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesSecurityCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let SecurityCalculations = 0
              for (var i = 0; i < PartiesParkingCalculationRatio?.length; i++) {
                let Ratios = PartiesParkingCalculationRatio[i];


                if (PartiesSecurityCalculationCategoriesSubCategories[i] != undefined && element.category.id == PartiesSecurityCalculationCategoriesSubCategories[i]) {
                  SecurityCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Security += (Ratios * SecurityCalculations)
                }
              }
              //End Security

              // Tips
              let PartiesTipsCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesTipsCalculationRatio)[0]?.description?.split(",");

              let PartiesTipsCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesTipsCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let TipsCalculations = 0
              for (var i = 0; i < PartiesTipsCalculationRatio?.length; i++) {
                let Ratios = PartiesTipsCalculationRatio[i]


                if (PartiesTipsCalculationCategoriesSubCategories[i] != undefined && element.category.id == PartiesTipsCalculationCategoriesSubCategories[i]) {
                  TipsCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Tips += (Ratios * TipsCalculations)
                }
              }
              //End Tips

              // End Code Hossam

              let total_laser = this.GroupData.laser + laserValue;
              let total_smoking = this.GroupData.Smoking + smoking;
              let total_laser_Supplier = this.GroupData.laserSupplier + laserValueSupplier;
              let total_smoking_Supplier = this.GroupData.SmokingSupplier + smokingSupplier;
              this.GroupData.laserDjSmoking = this.GroupData.Dj + total_laser + total_smoking;
              this.GroupData.laserDjSmokingSupplier = this.GroupData.DjSupplier + total_laser_Supplier + total_smoking_Supplier;
              this.GroupData.totalLights = this.GroupData.Lights + lights;
              this.GroupData.totalSound = this.GroupData.Sounds + sound;
              this.GroupData.totalScreens = this.GroupData.Screens + screens;
              this.GroupData.total_maintenance = maintenance + this.GroupData.Maintenance + this.GroupData.ExternalPurchases;





            }
            else if (element.sub_category != null) {

              // Beverage Calculation
              let subCatgorybeverageID = catgory?.data.filter((obj) => obj.id == environment.beverageCategoryAndSubCategoryId)[0]?.description?.split(",")

              subCatgorybeverageID?.forEach(element2 => {

                if (element.sub_category.id == element2) {

                  this.GroupData.beverage += Number((item.quantity - item.quantity_returned) * (element.product_variations[0].variations[0].default_sell_price));
                  // taxOfFoodAndBeverage+= this.GroupData.beverage *0.15
                  taxsCalc2(item);
                }
              })

              // End Beverage Calculation
              // Food Calculation
              let subCatgoryfoodID = catgory?.data.filter((obj) => obj.id == environment.foodCategoryAndSubCategoryId)[0]?.description?.split(",");

              subCatgoryfoodID?.forEach(element2 => {

                if (element.sub_category.id == element2) {
                  this.GroupData.food += Number((item.quantity - item.quantity_returned) * (element.product_variations[0].variations[0].default_sell_price));
                  taxsCalc2(item);

                }
              });

              // End Food Calculation
              // Rental , Depreciation And Supplementary Fund Calculation

              let subCatgorydepreciationID = catgory?.data.filter((obj) => obj.id == environment.partiesRentalCategoryAndSubcategoryID)[0]?.description?.split(",")

              subCatgorydepreciationID?.forEach(element2 => {
                // hsbat 15%
                if (element.sub_category.id == element2) {
                  let D = 100;   //Depreciation
                  let S = 200;   //SupplementaryFund
                  let R = 0;
                  R += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  if ((R - D - S) >= 0) {
                    D = 100;
                    S = 200;
                    this.GroupData.rental = R - (D + S);
                    this.GroupData.depreciation = D;
                    this.GroupData.SupplementaryFund = S;
                  }
                  else if ((R >= D) && ((R - D) < S)) {
                    D = 100;
                    S = 200;
                    this.GroupData.X = R - D - S;
                    R = R - (D + S) - this.GroupData.X;
                    this.GroupData.rental = R;
                    this.GroupData.depreciation = D;
                    this.GroupData.SupplementaryFund = S;
                  }
                  else if (R < D) {
                    D = 100;
                    S = 200;
                    this.GroupData.X = R - D - S;
                    R = R - (D + S) - this.GroupData.X;
                    this.GroupData.rental = R;
                    this.GroupData.depreciation = D;
                    this.GroupData.SupplementaryFund = S;
                  }
                }
              });
              // End Rental , Depreciation And Supplementary Fund Calculation

              // wedding
              let weddingRatio_2 = 0;
              let weddingRatio_3 = 0;
              let weddingCalculationsRatios = catgory?.data?.filter((obj) => obj.id == environment.weddingCalculationsRatios)[0]?.description?.split(",");

              let weddingCalculationsCategoriesSubCategories = catgory.data.filter((obj) => obj.id == environment.weddingCalculationsCategoriesSubCategories)[0]?.description?.split(",")

              let weddingCalculations = 0
              for (var i = 0; i < weddingCalculationsRatios?.length; i++) {
                let Ratios = weddingCalculationsRatios[i];
                // let weddingID = catgory?.data?.filter((obj) => obj.id == weddingCalculationsCategoriesSubCategories[i])[0]?.description;
                if (weddingCalculationsCategoriesSubCategories[i] != undefined && element.sub_category.id == weddingCalculationsCategoriesSubCategories[i]) {

                  weddingCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Wedding += (Number(Ratios) *
                    (
                      weddingCalculations - ((Number(catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_2)[0]?.description) + Number(catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_3)[0]?.description)) * weddingCalculations)
                    )
                  );
                  this.GroupData.weddingSupplier += (Number(1 - Ratios) *
                    (
                      weddingCalculations - ((Number(catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_2)[0]?.description) + Number(catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_3)[0]?.description)) * weddingCalculations)
                    )
                  )

                }

              }

              // end wedding

              // video&Photo
              let videoPhotosCalculationsRatios = catgory?.data?.filter((obj) => obj.id == environment.videoPhotosCalculationsRatios)[0]?.description?.split(",");
              let videoPhotosCalculationsCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.videoPhotosCalculationsCategoriesSubCategories)[0]?.description?.split(",");
              let videoPhotosCalculations = 0
              for (var i = 0; i < videoPhotosCalculationsRatios?.length; i++) {
                let Ratios = videoPhotosCalculationsRatios[i];

                if (videoPhotosCalculationsCategoriesSubCategories[i] != undefined) {

                  if (element.sub_category.id == videoPhotosCalculationsCategoriesSubCategories[i]) {

                    videoPhotosCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                    this.GroupData.videoPhotos += (Ratios * videoPhotosCalculations);
                    this.GroupData.videoPhotosSupplier += ((1 - Ratios) * videoPhotosCalculations)
                  }

                }
              }

              //end video&photo

              // weddingDesigner
              let weddingDesignerCalculationsRatios = catgory?.data?.filter((obj) => obj.id == environment.weddingDesignerCalculationsRatios)[0]?.description?.split(",");

              let weddingDesignerCalculationsCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.weddingDesignerCalculationsCategoriesSubCategories)[0]?.description?.split(",");


              let weddingDesignerCalculations = 0
              for (var i = 0; i < weddingDesignerCalculationsRatios?.length; i++) {
                let Ratios = weddingDesignerCalculationsRatios[i]


                if (weddingDesignerCalculationsCategoriesSubCategories[i] != undefined) {

                  if (element.sub_category.id == weddingDesignerCalculationsCategoriesSubCategories[i]) {
                    weddingDesignerCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                    this.GroupData.weddingDesigner += (Ratios * weddingDesignerCalculations)
                    this.GroupData.weddingDesignerSupplier += ((1 - Ratios) * weddingDesignerCalculations)
                  }

                }


              }
              //end weddingDesigner



              // fixedItemValues
              let fixedItemValuesCalculations = JSON.parse(catgory?.data?.filter((obj) => obj.id == environment.fixedItemValues)[0]?.description);
              let lights_open = fixedItemValuesCalculations[0]?.lights_open;
              let lights_close = fixedItemValuesCalculations[0]?.lights_close;
              let screens_open = fixedItemValuesCalculations[0]?.screens_open;
              let screens_close = fixedItemValuesCalculations[0]?.screens_close;
              let smoking_open = fixedItemValuesCalculations[0]?.smoking_open;
              let smoking_close = fixedItemValuesCalculations[0]?.smoking_close;
              let laser_open = fixedItemValuesCalculations[0]?.laser_open;
              let laser_close = fixedItemValuesCalculations[0]?.laser_close;
              let sound_open = fixedItemValuesCalculations[0]?.sound_open;
              let sound_close = fixedItemValuesCalculations[0]?.sound_close;
              let cover_open = fixedItemValuesCalculations[0]?.cover_open;
              let cover_close = fixedItemValuesCalculations[0]?.cover_close;
              let fixedItemValuesRatios = JSON.parse(catgory?.data?.filter((obj) => obj.id == environment.FixedItemsRatios)[0]?.description);
              let lights_open_Ration = fixedItemValuesRatios[0]?.lights_open;
              let lights_close_Ration = fixedItemValuesRatios[0]?.lights_close;
              let screens_open_Ration = fixedItemValuesRatios[0]?.screens_open;
              let screens_close_Ration = fixedItemValuesRatios[0]?.screens_close;
              let smoking_open_Ration = fixedItemValuesRatios[0]?.smoking_open;
              let smoking_close_Ration = fixedItemValuesRatios[0]?.smoking_close;
              let laser_open_Ration = fixedItemValuesRatios[0]?.laser_open;
              let laser_close_Ration = fixedItemValuesRatios[0]?.laser_close;
              let sound_open_Ration = fixedItemValuesRatios[0]?.sound_open;
              let sound_close_Ration = fixedItemValuesRatios[0]?.sound_close;
              let cover_open_Ration = fixedItemValuesRatios[0]?.cover_open;
              let cover_close_Ration = fixedItemValuesRatios[0]?.cover_close;
              // let maintenance_open = fixedItemValuesCalculations[0]?.maintenance_open;
              // let maintenance_close = fixedItemValuesCalculations[0]?.maintenance_close;
              let maintenance = 0;
              let qualntity = sell.custom_field_1;
              var res_table_id = table.filter((obj) => obj.id == sell.res_table_id)[0]?.description;
              let status = (res_table_id != undefined) ? JSON.parse(res_table_id)[0].status : ""; //table.describtion(index 0)
              // let laser_ratio_Ids = catgory?.data?.filter((obj) => obj.id == environment.laserCalculationsRatios)[0]?.description?.split(",");
              // let laser_close_ratio = catgory?.data?.filter((obj) => obj.id == laser_ratio_Ids[0])[0]?.description  // 0.85 // laserDJSmokingCalculationsRatios.describtion(index 0)?.description
              // let laser_open_ratio = catgory?.data?.filter((obj) => obj.id == laser_ratio_Ids[1])[0]?.description // laserDJSmokingCalculationsRatios.describtion(index 1)?.description



              let ExtraBuffetMoney = TotalBuffetCombo - (total_foodBeverage_in_combo + total_service_food_and_beverage); // Total Buffet - (food + beverage +15% of food and beverage)

              let buffet = ExtraBuffetMoney; // Total Buffet - (food + beverage +15% of food and beverage)


              if (sell.shipping_status != "cancelled") {
                if (status == "open") {
                  lights = lights_open * lights_open_Ration;
                  sound = sound_open * sound_open_Ration;
                  laserValue = laser_open * laser_open_Ration;
                  laserValueSupplier = laser_open * (1 - laser_open_Ration);
                  screens = screens_open * screens_open_Ration;
                  smoking = smoking_open * smoking_open_Ration;
                  smokingSupplier = smoking_open * (1 - smoking_open_Ration);
                  this.GroupData.covers = cover_open * cover_open_Ration * qualntity;

                  maintenance = buffet - (lights + screens + smoking + laserValue + sound + this.GroupData.covers); // Will be added to maintenance

                }

                else if (status == "close") {
                  lights = lights_close * lights_close_Ration;
                  sound = sound_close * sound_close_Ration;
                  laserValue = laser_close * laser_close_Ration;
                  laserValueSupplier = laser_close * (1 - laser_close_Ration);
                  screens = screens_close * screens_close_Ration;
                  smoking = smoking_close * smoking_close_Ration;
                  smokingSupplier = smoking_close * (1 - smoking_close_Ration);
                  this.GroupData.covers = cover_close * cover_close_Ration * qualntity;

                  maintenance = buffet - (lights + screens + smoking + laserValue + sound + this.GroupData.covers); // Will be added to maintenance

                }

              }



              //end fixedItemValues
              // laser

              let laserCalculationsRatios = catgory?.data?.filter((obj) => obj.id == environment.laserCalculationsRatios)[0]?.description?.split(",");

              let laserCalculationsCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.laserCalculationsCategoriesSubCategories)[0]?.description?.split(",")

              let laserCalculations = 0
              for (var i = 0; i < laserCalculationsRatios?.length; i++) {
                let Ratios = laserCalculationsRatios[i];
                if (laserCalculationsCategoriesSubCategories[i] != undefined && element.sub_category.id == laserCalculationsCategoriesSubCategories[i]) {
                  laserCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.laser += (Ratios * laserCalculations)
                  this.GroupData.laserSupplier += ((1 - Ratios) * laserCalculations)
                }
              }
              //end laser
              // DJ
              let DJCalculationsRatios = catgory?.data?.filter((obj) => obj.id == environment.DJCalculationsRatios)[0]?.description?.split(",");

              let DJCalculationsCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.DJCalculationsCategoriesSubCategories)[0]?.description?.split(",")

              let DJCalculations = 0
              for (var i = 0; i < DJCalculationsRatios?.length; i++) {

                let Ratios = DJCalculationsRatios[i];

                if (DJCalculationsCategoriesSubCategories[i] != undefined && element.sub_category.id == DJCalculationsCategoriesSubCategories[i]) {
                  DJCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Dj += (Ratios) * (DJCalculations - (catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_3)[0]?.description) * (DJCalculations))
                  this.GroupData.DjSupplier += (1 - Ratios) * (DJCalculations - (catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_3)[0]?.description) * (DJCalculations))
                }
              }

              //end DJ
              // Smoking
              let SmokingCalculationsRatios = catgory?.data?.filter((obj) => obj.id == environment.SmokingCalculationsRatios)[0]?.description?.split(",");

              let SmokingCalculationsCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.SmokingCalculationsCategoriesSubCategories)[0]?.description?.split(",")

              let SmokingCalculations = 0
              for (var i = 0; i < SmokingCalculationsRatios?.length; i++) {
                let Ratios = SmokingCalculationsRatios[i];
                if (SmokingCalculationsCategoriesSubCategories[i] != undefined && element.sub_category.id == SmokingCalculationsCategoriesSubCategories[i]) {
                  SmokingCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Smoking += (Ratios * SmokingCalculations)
                  this.GroupData.SmokingSupplier += ((1 - Ratios) * SmokingCalculations)
                }
              }
              //end Smoking
              // Calculate Wedding 2% And 3 %
              this.GroupData.partiesRatio_2 += (catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_2)[0]?.description) * weddingCalculations;
              weddingRatio_2 = this.GroupData.partiesRatio_2;
              weddingRatio_3 = (catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_3)[0]?.description) * (weddingCalculations)
              dJRatio_3 = (catgory?.data?.filter((obj) => obj.id == environment.partiesRatio_3)[0]?.description) * (DJCalculations)
              this.GroupData.partiesRatio_3 += weddingRatio_3 + dJRatio_3
              // // End Calculate Wedding 2% And 3 %



              //  code Hosssssssssam

              // Lights
              let PartiesLightsCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesLightsCalculationRatio)[0]?.description?.split(",");

              let PartiesFixedItemsLightsCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesFixedItemsLightsCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let LightsCalculations = 0
              for (var i = 0; i < PartiesLightsCalculationRatio?.length; i++) {
                let Ratios = PartiesLightsCalculationRatio[i]


                if (PartiesFixedItemsLightsCalculationCategoriesSubCategories[i] != undefined && element.sub_category.id == PartiesFixedItemsLightsCalculationCategoriesSubCategories[i]) {
                  LightsCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Lights += (Ratios * LightsCalculations)
                }
              }
              //End Lights

              // Sounds
              let PartiesSoundsCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesSoundsCalculationRatio)[0]?.description?.split(",");

              let PartiesFixedItemsSoundsCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesFixedItemsSoundsCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let SoundsCalculations = 0
              for (var i = 0; i < PartiesSoundsCalculationRatio?.length; i++) {
                let Ratios = PartiesSoundsCalculationRatio[i]

                if (PartiesFixedItemsSoundsCalculationCategoriesSubCategories[i] != undefined && element.sub_category.id == PartiesFixedItemsSoundsCalculationCategoriesSubCategories[i]) {
                  SoundsCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Sounds += (Ratios * SoundsCalculations)

                }
              }
              //End Sounds

              // Screens
              let PartiesScreensCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesScreensCalculationRatio)[0]?.description?.split(",");

              let PartiesFixedItemsScreensCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesFixedItemsScreensCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let ScreensCalculations = 0
              for (var i = 0; i < PartiesScreensCalculationRatio?.length; i++) {
                let Ratios = PartiesScreensCalculationRatio[i]

                if (PartiesFixedItemsScreensCalculationCategoriesSubCategories[i] != undefined && element.sub_category.id == PartiesFixedItemsScreensCalculationCategoriesSubCategories[i]) {
                  ScreensCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Screens += (Ratios * ScreensCalculations)
                }
              }
              //End Screens

              // Hall Opening Fees
              let PartiesHallopeningfeesCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesHallopeningfeesCalculationRatio)[0]?.description?.split(",");

              let PartiesHallopeningfeesCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesHallopeningfeesCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let HallOpeningFeesCalculations = 0
              for (var i = 0; i < PartiesHallopeningfeesCalculationRatio?.length; i++) {
                let Ratios = PartiesHallopeningfeesCalculationRatio[i];

                if (PartiesHallopeningfeesCalculationCategoriesSubCategories[i] != undefined && element.sub_category.id == PartiesHallopeningfeesCalculationCategoriesSubCategories[i]) {

                  HallOpeningFeesCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.HallOpeningFees += (Ratios * HallOpeningFeesCalculations)
                }
              }
              //End Hall Opening Fees

              // External Purchases
              let PartiesExternalPurchasesCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesExternalPurchasesCalculationRatio)[0]?.description?.split(",");

              let PartiesExternalPurchasesCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesExternalPurchasesCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let ExternalPurchasesCalculations = 0
              for (var i = 0; i < PartiesExternalPurchasesCalculationRatio?.length; i++) {
                let Ratios = PartiesExternalPurchasesCalculationRatio[i];

                if (PartiesExternalPurchasesCalculationCategoriesSubCategories[i] != undefined && element.sub_category.id == PartiesExternalPurchasesCalculationCategoriesSubCategories[i]) {
                  ExternalPurchasesCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.ExternalPurchases += (Ratios * ExternalPurchasesCalculations)
                }
              }
              //End External Purchases

              // Maintenance
              let PartiesMaintenanceCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesMaintenanceCalculationRatio)[0]?.description?.split(",");

              let PartiesMaintenanceCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesMaintenanceCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let MaintenanceCalculations = 0
              for (var i = 0; i < PartiesMaintenanceCalculationRatio?.length; i++) {
                let Ratios = PartiesMaintenanceCalculationRatio[i];

                if (PartiesMaintenanceCalculationCategoriesSubCategories[i] != undefined && element.sub_category.id == PartiesMaintenanceCalculationCategoriesSubCategories[i]) {

                  MaintenanceCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Maintenance += (Ratios * MaintenanceCalculations)
                }
              }
              //End Maintenance

              // Security
              let PartiesParkingCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesParkingCalculationRatio)[0]?.description?.split(",");

              let PartiesSecurityCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesSecurityCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let SecurityCalculations = 0
              for (var i = 0; i < PartiesParkingCalculationRatio?.length; i++) {
                let Ratios = PartiesParkingCalculationRatio[i];


                if (PartiesSecurityCalculationCategoriesSubCategories[i] != undefined && element.sub_category.id == PartiesSecurityCalculationCategoriesSubCategories[i]) {
                  SecurityCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Security += (Ratios * SecurityCalculations)
                }
              }
              //End Security

              // Tips
              let PartiesTipsCalculationRatio = catgory?.data?.filter((obj) => obj.id == environment.PartiesTipsCalculationRatio)[0]?.description?.split(",");

              let PartiesTipsCalculationCategoriesSubCategories = catgory?.data?.filter((obj) => obj.id == environment.PartiesTipsCalculationCategoriesSubCategories)[0]?.description?.split(",")

              let TipsCalculations = 0
              for (var i = 0; i < PartiesTipsCalculationRatio?.length; i++) {
                let Ratios = PartiesTipsCalculationRatio[i];

                if (PartiesTipsCalculationCategoriesSubCategories[i] != undefined && element.sub_category.id == PartiesTipsCalculationCategoriesSubCategories[i]) {
                  TipsCalculations += Number((item.quantity - item.quantity_returned) * item.unit_price)
                  this.GroupData.Tips += (Ratios * TipsCalculations)
                }
              }
              //End Tips
              // End Code Hossam

              let total_laser = this.GroupData.laser + laserValue;
              let total_smoking = this.GroupData.Smoking + smoking;
              let total_laser_Supplier = this.GroupData.laserSupplier + laserValueSupplier;
              let total_smoking_Supplier = this.GroupData.SmokingSupplier + smokingSupplier;
              this.GroupData.laserDjSmoking = this.GroupData.Dj + total_laser + total_smoking;
              this.GroupData.laserDjSmokingSupplier = this.GroupData.DjSupplier + total_laser_Supplier + total_smoking_Supplier;
              this.GroupData.totalLights = this.GroupData.Lights + lights;
              this.GroupData.totalSound = this.GroupData.Sounds + sound;
              this.GroupData.totalScreens = this.GroupData.Screens + screens;
              this.GroupData.total_maintenance = maintenance + this.GroupData.Maintenance + this.GroupData.ExternalPurchases;





            }

            else if (element.category == null) {
              this.GroupData.food += Number((item.quantity - item.quantity_returned) * (element.product_variations[0].variations[0].default_sell_price));
              // taxOfFoodAndBeverage+= this.GroupData.food *0.15
              taxsCalc2(item);

            }


            // this.GroupData.laserDjSmoking = total_laser_dj_smoking_subcategories + total_laser_dj_smoking_categories;

            let catgorybeverageID = catgory?.data.filter((obj) => obj.id == environment.beverageCategoryAndSubCategoryId)[0]?.description?.split(",");
            let subCatgorybeverageID = catgory?.data.filter((obj) => obj.id == environment.beverageCategoryAndSubCategoryId)[0]?.description?.split(",");
            let catgoryfoodID = catgory?.data.filter((obj) => obj.id == environment.foodCategoryAndSubCategoryId)[0]?.description?.split(",");
            let subCatgoryfoodID = catgory?.data.filter((obj) => obj.id == environment.foodCategoryAndSubCategoryId)[0]?.description?.split(",");
            let baverageIDs = [];
            if (catgorybeverageID) {
              baverageIDs.push(...catgorybeverageID)

            }
            if (subCatgorybeverageID) {
              baverageIDs.push(...subCatgorybeverageID)
            }
            if (catgoryfoodID) {
              baverageIDs.push(...catgoryfoodID)
            }
            if (subCatgoryfoodID) {
              baverageIDs.push(...subCatgoryfoodID)
            }



            if (element.category != null && !(baverageIDs.includes(element.category.id))) {
              if (item.tax_id == environment.service15) {

                this.GroupData.service15 += (Number(item.item_tax) *
                  (Number(item.quantity) - Number(item.quantity_returned)));

              }
            }
            if (element.sub_category != null && !(baverageIDs.includes(element.sub_category.id))) {
              if (item.tax_id == environment.service15) {

                this.GroupData.service15 += (Number(item.item_tax) *
                  (Number(item.quantity) - Number(item.quantity_returned)));
              }
            }

          }
        })
      )
    })
    this.GroupData.finalTax15 = this.GroupData.service15 + taxOfFoodAndBeverage;



    this.GroupData.armed_force_discount_amount = (sell.discount_type == "fixed") ? Number(sell.discount_amount) : 0;
    this.GroupData.total = (this.GroupData.food + this.GroupData.beverage + this.GroupData.covers + this.GroupData.finalTax15 + this.GroupData.depreciation + this.GroupData.totalLights + this.GroupData.SupplementaryFund + this.GroupData.Security + this.GroupData.total_maintenance + this.GroupData.partiesRatio_2 + this.GroupData.partiesRatio_3 + this.GroupData.Tips + this.GroupData.rental + this.GroupData.totalSound + this.GroupData.totalScreens + this.GroupData.HallOpeningFees + this.GroupData.videoPhotos + this.GroupData.laserDjSmoking + this.GroupData.weddingDesigner + this.GroupData.Wedding);
    this.GroupData.totalSupplier = (this.GroupData.weddingSupplier + this.GroupData.weddingDesignerSupplier + this.GroupData.laserDjSmokingSupplier + this.GroupData.videoPhotosSupplier)
    sell.payment_lines?.forEach(element => {

      if (element.method == "cash") {
        this.GroupData.cash += Number(element.amount)
      }
      else if (element.method == "card") {

        this.GroupData.card += Number(element.amount)
      }
      else if (element.method == "custom_pay_1") {
        this.GroupData.custom_pay_1 += Number(element.amount)
      }

    });
    this.GroupData.TotalPayments1_11 = sell.final_total - (this.GroupData.cash + this.GroupData.card + this.GroupData.custom_pay_1)
    this.GroupData.final_total = Number(sell.final_total);
    this.GroupData.id = Number(sell.id);
    this._dataShared.changeCurrentTotalFood(this.GroupData)

    return this.GroupData;
  }
  constructor(private _dataShared: SharedService) {
  }
}





