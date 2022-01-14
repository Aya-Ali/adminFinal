import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { SharedService } from '../dataShared';
import { Lang } from '../lang';
import { LangAr } from '../langAr';
import { LangEn } from '../langEn';
import { RecipeService } from '../recipe.service';
import * as moment from 'moment';
import { BehaviorSubject, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { KitchenService } from '../kitchen.service';
declare let $: any;
@Component({
  selector: 'app-fb-control',
  templateUrl: './fb-control.component.html',
  styleUrls: ['./fb-control.component.css']
})
export class FbControlComponent implements OnInit {
  public sells: any = [];
  public allRecipe: any = [];
  public allCategory: any = [];
  public allCategoryCopy: any = [];
  public orderQuantity: any = [];
  public StockValue: any = [];
  public startDate: any;
  public endDate: any;
  public category: any;
  public userData: any;
  public Locations;
  public location: any = ' ';
  public _langChange: any;
  public selected: any;
  public alwaysShowCalendars: boolean;
  public showRangeLabelOnInput: boolean;
  public keepCalendarOpeningWithRange: boolean;
  public loading2: boolean = false;
  public rationCheck: boolean = false;
  public roleNumber: string;
  public location_id;
  public lang: string = "en";
  public filterValueCopy: string = "*";

  public totalStockCostPrice: number = 0;
  public totalStockSellingPrice: number = 0;
  public totalQantityCostPrice: number = 0;
  public location_name: string;
  public sellsData = new BehaviorSubject<any>([]);
  public saveAllCategory: any = [];
  public searchValue: string = '';
  public ratioValue: any;
  public subCategoryValue: any = '*';
  public categoryValue: any = '*';
  public selectedAll: boolean = false;
  public selectedSubCategory: boolean = false;
  public load = new Subject<boolean>();
  public ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'this year': [
      moment()
        .subtract(0, 'year')
        .startOf('year'),
      moment()
        .subtract(0, 'year')
        .endOf('year')
    ],
  };
  public selectedOption = new BehaviorSubject<string>('*');
  constructor(private _RecipeService: RecipeService, private _authService: AuthService, private _DatePipe: DatePipe, private _dataShared: SharedService, public _KitchenService: KitchenService,
    private _router: Router) {
    this._dataShared.changeCurrentLoading(true);
    this.location_id = localStorage.getItem('userLocation');
    this.getAllRecipe(this.location);
    this.getCategory()
    let date = new Date();
    let date1 = date.toLocaleString('en', { timeZone: 'Africa/Cairo' });
    this.startDate = this._DatePipe.transform(date1, 'yyyy-MM-dd');
    this.endDate = this.startDate;
    this.selected = {
      startDate: moment(),
      endDate: moment()
    };
    this._router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects
        ) {
          this._router.navigate(['/admin']);
          localStorage.setItem("path", "sells")
        }
      })
  }
  printData(id) {
    var divToPrint = document.getElementById(id);
    let newWin = window.open("");
    newWin.document.write(`<div style="text-align:center"><h1 >F&B Report</h1><h2 >${(this.location_name) ? this.location_name : ""}</h2><span>${this.startDate}</span> - <span>${this.endDate}</span></div>` + divToPrint.outerHTML + `<p style="text-align:center;">© Copyright 2020
    <span >${environment.copyright1}</span>
    , Developed By
    ${environment.copyright2}
  </p>`);
    newWin.print();
    newWin.close();
  }
  exportThisWithParameter(tableID: any, excelName: any) {
    var uri = 'data:application/vnd.ms-excel;base64,',
      template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"  xmlns="http://www.w3.org/TR/REC-html40"><head> <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets> <x:ExcelWorksheet><x:Name>{worksheet}</x:Name> <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions> </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook> </xml><![endif]--></head><body><div style="text-align:center"><h1 >F&B Report</h1><h2 >${(this.location_name) ? this.location_name : ""}</h2><span>${this.startDate}</span> - <span>${this.endDate}</span></div> <table>{table}</table><p style="text-align:center;">© Copyright 2020
      <span >${environment.copyright1}</span>
      , Developed By
      ${environment.copyright2}
    </p></body></html>`,
      base64 = function (s: any) {
        return window.btoa(unescape(encodeURIComponent(s)))
      },
      format = function (s: any, c: any) {
        return s.replace(/{(\w+)}/g, function (m: any, p: any) { return c[p]; })
      }

    tableID = document.getElementById(tableID)
    var ctx = { worksheet: excelName || 'Worksheet', table: tableID.innerHTML }
    return window.location.href = uri + base64(format(template, ctx))

  }

  getAllRecipe(mylocation = ' ') {
    this.loading2 = true;
    this._dataShared.currentallRecipes.subscribe((data) => {
      this.allRecipe = JSON.parse(JSON.stringify(data));
      this.loading2 = false;
      if (this.allRecipe?.length > 0) {
        this._dataShared.changeCurrentLoading(false);
        this.allRecipe.forEach((obj) => {
          obj.product_variations[0].variations.forEach((item) => {
            item.variation_location_details = item.variation_location_details.filter((item2) => {
              return !(mylocation == ' ' || mylocation == '*') ? item2.location_id == mylocation : true
            })
          })
        })

        this.allCategoryCopy = JSON.parse(JSON.stringify(this.allRecipe))
      }
    })
  }

  getCategory() {
    this._RecipeService.getCategory().subscribe((data) => {
      this.allCategory = data.data;
      this.allCategory = this.allCategory.filter((obj) => obj.short_code != 0)
      this.saveAllCategory = this.allCategory
    })



  }


  getSells(start, end, location) {
    this.loading2 = true;
    this._RecipeService.getAllSell(start, end, location).subscribe((data) => {
      this.sellsData.next(data.data)

    }, () => { }, () => {
      this.getAllSell(start, end, location)
      this.FilterLocation(this.filterValueCopy)
      this.loading2 = false
    })
  }

  getAllSell(start, end, mylocation = ' ') {
    // this.loading2 = true;
    this.sellsData.subscribe((data) => {
      this.sells = data;
      let dataArray2 = [];
      dataArray2 = this.sells;

      this.orderQuantity = [];
      let dataArray = dataArray2.filter(
        (obj) => {
          return obj.status == "final" && !(mylocation == ' ' || mylocation == '*') ? obj.location_id == mylocation : true && obj.sell_lines.some((item) => item.product_id != 1)
        }
      );
      this.sells = dataArray
      this.allCategory = this.saveAllCategory.filter((obj) => {
        return obj.short_code != 0 && this.allRecipe.some((item) => {
          return (item.category != null && obj.id == item.category.id)
        })
      })
      this.calcQuantity(this.sells)
    })
  }


  calcQuantity(sells) {
    const merageQuanty = (data) => {
      let result = [];
      var index1;
      for (let i = 0; i < data.length; i++) {
        var obj = data[i];
        index1 = result.findIndex(
          (index) => index.id == obj.product_id && index.variation_id == obj.variation_id
        );
        if (index1 >= 0) {
          result[index1].avgUnit_price += (obj.quantity * obj.unit_price)
          result[index1].qunt += obj.quantity;
        } else {
          result.push({ id: obj.product_id, qunt: obj.quantity, variation_id: obj.variation_id, avgUnit_price: obj.quantity * obj.unit_price });
        }
      }

      return result;
    };
    let data5 = [];
    sells.forEach((element) => {
      data5.push(...element.sell_lines);
    });
    data5 = data5.filter((item) => item.children_type != "combo");

    let Recipes = this.allRecipe.filter((obj) => {
      return data5.some((item) => {
        return (obj.id == item.product_id)
      })
    })
    this.allCategory = this.saveAllCategory.filter((obj) => {
      return obj.short_code != 0 && Recipes.some((item) => {
        return (item.category != null && obj.id == item.category.id)
      })
    })
    this.orderQuantity = merageQuanty(data5);
    this.allCategoryCopy = this.orderQuantity
    this.load.next(true);
    // this.getStockValue()
  }

  FilterLocation(filterValue, Select?: boolean) {
    this.selectedAll = false;
    this.selectedSubCategory = false;
    if (filterValue != '*' && Select) {
      this.searchValue = '';
      this.subCategoryValue = '*';
      this.ratioValue = undefined;
      this.selectedAll = true
      this.rationCheck = false;
      this.categoryValue = '*'
    }
    let locationName = this.Locations.filter((obj) => {
      // return (filterValue == "null") ? (obj.custom_field1 == null) : (obj.custom_field1 == filterValue)
      let Value;
      this.filterValueCopy = filterValue
      if (filterValue == "null") {
        Value = (obj.custom_field1 == null)
      }
      else if (filterValue == "*") {
        Value = true
      }
      else if (filterValue == "RF") {
        Value = (obj.custom_field1 == "F" || obj.custom_field1 == "R")
      }
      else {
        Value = (obj.custom_field1 == filterValue)
      }
      return Value
    });

    let sells = this.sells.filter((item) => {
      return locationName.some(obj => obj.id == item.location_id)
    })

    this.calcQuantity(sells)

  }

  getStockValue() {
    const merageQuanty = (data) => {
      let result = [];
      let result2 = [];
      let result3 = [];
      var index1 = -1;
      var index2 = -1;
      let quantity = 0;
      let CostPrice = 0;
      let SellingCost = 0;
      for (let i = 0; i < data.length; i++) {
        var obj = data[i];
        let ProductData = this.allRecipe.filter((obj2) => obj2.id == obj.product_id)[0];
        let variation = ProductData.product_variations[0].variations.filter((item) => item.id == obj.variation_id)[0];
        index1 = result.findIndex(
          (index) => ProductData.category != null && index.id == ProductData.category.id);
        index2 = result2.findIndex(
          (index) => ProductData.sub_category != null && index.id == ProductData.sub_category.id);
        // index3 = result3.findIndex(
        //   (index) => ProductData.category == null);

        if (index1 >= 0) {
          // obj.product_variations[0].variations[0].default_sell_price;
          let quantity = 0;
          quantity = obj.quantity;
          result[index1].costPrice += Number(variation.dpp_inc_tax) * quantity;
          result[index1].sellingPrice += quantity * Number(obj.unit_price);
          result[index1].quantities += obj.quantity;
        } else {
          if (ProductData.category != null) {
            let quantity = 0;
            let CostPrice = 0;
            let SellingCost = 0;

            quantity = obj.quantity;
            CostPrice = Number(variation.dpp_inc_tax) * quantity;
            SellingCost = quantity * Number(obj.unit_price);

            result.push({ id: ProductData.category.id, category: "category", name: ProductData.category.name, quantities: obj.quantity, costPrice: CostPrice, sellingPrice: SellingCost });
          }
        }
        if (index2 >= 0) {
          // obj.product_variations[0].variations[0].default_sell_price;
          let quantity = 0;

          quantity = obj.quantity;
          result2[index2].costPrice += Number(variation.dpp_inc_tax) * quantity;

          result2[index2].sellingPrice += quantity * Number(obj.unit_price);

          result2[index2].quantities += obj.quantity;
        } else {
          if (ProductData.sub_category != null) {
            let quantity = 0;
            let CostPrice = 0;
            let SellingCost = 0;
            quantity = obj.quantity;
            CostPrice = Number(variation.dpp_inc_tax) * quantity;
            SellingCost = quantity * Number(obj.unit_price);

            result2.push({ id: ProductData.sub_category.id, category: "sub_category", name: ProductData.sub_category.name, quantities: obj.quantity, costPrice: CostPrice, sellingPrice: SellingCost });
          }
        }

        if (ProductData.category == null) {
          // obj.product_variations[0].variations[0].default_sell_price;

          quantity += obj.quantity;
          CostPrice += Number(variation.dpp_inc_tax) * obj.quantity;
          SellingCost += obj.quantity * Number(obj.unit_price);
          result3 = [{ id: ProductData.id, category: "uncategory", name: "uncategorized", quantities: quantity, costPrice: CostPrice, sellingPrice: SellingCost }];
        }
      }

      return [...result, ...result2, ...result3];
    };

    // if (this.allRecipe != null) {
    // let Recipes = this.allRecipe.filter((obj) => {
    //   return sells.some((item) => item.id == obj.id)
    // })
    let data5 = [];
    this.sells.forEach((element) => {
      data5.push(...element.sell_lines);
    });
    data5 = data5.filter((item) => item.children_type != "combo");
    this.StockValue = merageQuanty(data5);
    this.totalQantityCostPrice = 0;
    this.totalStockCostPrice = 0;
    this.totalStockSellingPrice = 0;
    this.StockValue.forEach(element => {
      if (element.category == 'category' || element.category == 'uncategory') {
        this.totalQantityCostPrice += element.quantities;
        this.totalStockCostPrice += element.costPrice;
        this.totalStockSellingPrice += element.sellingPrice
      }
    });
    // }

  }
  // Refresh Button To Get New Sell Data
  refreshSell(event) {
    $(event.target).children().toggleClass('down');
    this.getSells(this.startDate, this.endDate, this.location_id);
  }
  // User LogOut
  logOut() {
    this._KitchenService.logOut().subscribe((data) => {

      if (data.success) {
        this._dataShared.changeRoles(null);
        this._router.navigate(['/admin']);
        localStorage.clear()
      }
    })
  }

  // Get User Data
  getUserData() {
    this._dataShared.currentallUsers.subscribe((data) => {
      if (data) {
        this.userData = data;
        if (this.userData) {
          this.roleNumber = this.userData.role;
          if (this.userData.locations.length > 1) {
            this.location_id = ' '
          }
          this.roleNumber = this.userData.role;
          this.Locations = this.userData.locations;
          if (this.roleNumber == '6') {
            this.Locations = this.Locations.filter((obj) => {
              return (obj.custom_field1 == 'P' || obj.custom_field1 == "R")
            })
          }
          else if (this.roleNumber == '9') {
            this.Locations = this.Locations.filter((obj) => {
              return (obj.custom_field1 == 'P' || obj.custom_field1 == "R" || obj.custom_field1 == "F")
            })
          }
        }
      }
    });
  }

  //get Select Option
  selectTime(time) {
    this.rationCheck = false;
    this.startDate = this._DatePipe.transform(time.startDate._d, 'yyyy-MM-dd');
    this.endDate = this._DatePipe.transform(time.endDate._d, 'yyyy-MM-dd');
    this.getSells(this.startDate, this.endDate, this.location_id);
    // this.today = time;
  }
  //get Select Option
  selectOption(location) {
    this.rationCheck = false;

    this.location = location;
    this.location_name = this.Locations.filter((obj) => obj.id == location)[0]?.name
    this.getAllRecipe(this.location);
    this.getAllSell(this.startDate, this.endDate, this.location);
  }
  search(value) {
    this.rationCheck = false;
    this.searchValue = value
    this.filterAllData(this.searchValue, this.categoryValue, this.subCategoryValue, this.ratioValue)
  }

  categoryOptions(value) {
    this.categoryValue = value;
    this.selectedSubCategory = false;
    this.subCategoryValue = '*'
    this.filterAllData(this.searchValue, this.categoryValue, this.subCategoryValue, this.ratioValue)

  }

  subCategoryOptions(value) {
    this.rationCheck = false;
    this.subCategoryValue = value;
    this.filterAllData(this.searchValue, 'sub', this.subCategoryValue, this.ratioValue)

  }

  RatioFilter(event) {
    this.rationCheck = true;
    this.ratioValue = event
    this.filterAllData(this.searchValue, this.categoryValue, this.subCategoryValue, this.ratioValue)
  }
  filterAllData(searchValue, category, subCategory, Ratio) {
    this.selectedAll = false;
    this.FilterLocation(this.filterValueCopy)
    if (searchValue != '') {
      this.orderQuantity = this.orderQuantity.filter((item) => {
        return this.allRecipe.some((obj) => {
          if (obj.id == item.id && obj.product_custom_field1 != null) {
            return (obj.name.toLowerCase().includes(searchValue.toLowerCase()) || obj.product_custom_field1.toLowerCase().includes(searchValue.toLowerCase()) || obj.sku.toLowerCase().includes(searchValue.toLowerCase()))
          }
          else if (obj.id == item.id) {
            return (obj.name.toLowerCase().includes(searchValue.toLowerCase()) || obj.sku.toLowerCase().includes(searchValue.toLowerCase()))
          }

        })
      })
    }
    if (category != 'sub') {
      if (category != "*") {
        let myCategory = JSON.parse(category)
        this.category = myCategory;
        this.orderQuantity = this.orderQuantity.filter((item) => {
          return this.allRecipe.some((obj) => {
            if (obj.id == item.id) {
              if (obj.category != null) {
                return obj.category.id == myCategory.id
              }
            }
          })
        })
      }
    }
    else {
      if (category != "*") {
        let myCategory = JSON.parse(this.categoryValue)
        this.orderQuantity = this.orderQuantity.filter((item) => {
          return this.allRecipe.some((obj) => {
            if (obj.id == item.id) {
              if (obj.category != null) {
                return obj.category.id == myCategory.id
              }
            }
          })
        })
      }
    }
    if (category != "*") {
      this.selectedSubCategory = true
    }

    if (subCategory != "*") {
      this.orderQuantity = this.orderQuantity.filter((item) => {
        return this.allRecipe.some((obj) => {
          if (obj.id == item.id) {
            if (obj.sub_category != null) {
              return obj.sub_category.id == subCategory
            }
          }
        })
      })
    }

    if (Ratio != undefined && Ratio.checked) {
      this.orderQuantity = this.orderQuantity.filter((item) => {
        let ProductCost = this.allRecipe.filter((obj) => item.id == obj.id)[0].product_variations[0].variations.filter(obj => obj.id == item.variation_id)[0].dpp_inc_tax
        return ((ProductCost / (item.avgUnit_price / item.qunt)) * 100 >= 50)
      })
    }
  }
  ngOnInit(): void {
    $(window).scroll(function () {

      $(".table .thead").css("top", $("nav").outerHeight() - 2)
    })
    // this.getSells(this.startDate, this.endDate);

    this._dataShared.langVar.subscribe((id) => (this._langChange = id));
    this._dataShared.langVar2.subscribe((id) => (this.lang = id));
    if (this.lang == '') {
      this.lang = this._authService.getUserLanguage();
    }
    this._langChange = LangEn;

    this.getUserData();


    if (this._authService.getUserLanguage() == 'ar') {
      Lang.changeDirection('rtl');
      // this.lang = 'ar'
      this._langChange = LangAr;
    } else {
      this._langChange = LangEn;
      // this.lang = 'en'
    }


  }

}


