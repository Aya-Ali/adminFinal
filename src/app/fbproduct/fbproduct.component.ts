import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthService } from '../auth.service';
import { SharedService } from '../dataShared';
import { Lang } from '../lang';
import { LangAr } from '../langAr';
import { LangEn } from '../langEn';
import { RecipeService } from '../recipe.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { KitchenService } from '../kitchen.service';
declare let $: any;
@Component({
  selector: 'app-fbproduct',
  templateUrl: './fbproduct.component.html',
  styleUrls: ['./fbproduct.component.css']
})
export class FbproductComponent implements OnInit {
  public allRecipe: any = [];
  public metaRecipe: any = [];
  public allCategory: any = [];
  public saveAllCategory: any = [];
  public allCategoryCopy: any = [];
  public orderQuantity: any = [];
  public StockValue: any = [];
  public userData: any;
  public Locations;
  public category: any = '';
  public location: any = ' ';
  public _langChange: any;
  public loading2: boolean = false;
  public selectedAll: boolean = false;
  public selectedSubCategory: boolean = false;
  public roleNumber: string;
  public location_id;
  public lang: string = "en";
  public totalProductSum: Number = 0;
  public totalProfitSum: Number = 0;
  public location_name: string;
  public SubCategory_name: string;
  public filterValueCopy: string = '*';
  public searchValue: string = '';
  public value: string = '*';
  public searchValueModel: string = '';
  public skuValue: string = '';
  public ratioValue: any;

  public subCategoryValue: any = '';
  public perPage: any = '50';
  public categoryValue: any = '';
  public rationCheck: boolean = false;
  public sellCheck: boolean = true;
  public CategoryCheckValue: boolean = true;
  public arrayOrder = [];
  public TotalSum = {
    totalProductSum: 0,
    totalSellSum: 0,
    totalProfitSum: 0,
    totalStock: 0,
    totalCostProduct: 0,
    totalCostSell: 0,
    quantity: 0,
  };
  @ViewChildren('totalProduct') public totalProduct: QueryList<ElementRef>;
  @ViewChildren('totalProfit') public totalProfit: QueryList<ElementRef>;
  public load = new Subject<boolean>();
  public selectedOption = new BehaviorSubject<string>('*');
  totalStockCostPrice: Number;
  totalStockSellingPrice: Number;
  totalStock: Number;
  constructor(public _KitchenService: KitchenService, private _RecipeService: RecipeService, private _authService: AuthService, private _dataShared: SharedService,
    private _router: Router) {
    this._dataShared.changeCurrentLoading(true);
    // this.getAllRecipe();

    this.getCategory()
    this._router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects
        ) {
          this._router.navigate(['/admin']);
          localStorage.setItem("path", "product")
        }
      })
  }
  printData(id) {
    var divToPrint = document.getElementById(id);
    let newWin = window.open("");
    newWin.document.write(`<div style="text-align:center"><h1 >Products Report</h1><h2 >${(this.location_name) ? this.location_name : ""}</h2></div>` + divToPrint.outerHTML + `<p style="text-align:center;">© Copyright 2020
    <span >${environment.copyright1}</span>
    , Developed By
    ${environment.copyright2}
  </p>`);
    newWin.print();
    newWin.close();

  }
  getAllDate() {
    this.allRecipe = [];
    this.perPage = "-1"
    this.getRecipeByScroll(this.perPage, 1, this.categoryValue, this.subCategoryValue, this.location, this.searchValue, this.skuValue)
  }
  exportThisWithParameter(tableID: any, excelName: any) {
    var uri = 'data:application/vnd.ms-excel;base64,',
      template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"  xmlns="http://www.w3.org/TR/REC-html40"><head> <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets> <x:ExcelWorksheet><x:Name>{worksheet}</x:Name> <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions> </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook> </xml><![endif]--></head><body><div style="text-align:center"><h1 >Products Report</h1><h2 >${(this.location_name) ? this.location_name : ""}</h2></div> <table>{table}</table><p style="text-align:center;">© Copyright 2020
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
  getRecipeByScroll(perPage: string = "50", page = 1, categoryId: string = '', subCategory: string = '', location: string = this.location, search: string = '', sku: string = '') {
    this.loading2 = true;
    this._RecipeService.getRecipeByScroll(perPage, page, categoryId, subCategory, location, search, sku).subscribe((data) => {
      this.rationCheck = false;
      // this.allRecipe = [];
      this.allRecipe.push(...data.data);
      this.allCategoryCopy = this.allRecipe
      this.metaRecipe = data.meta;
      (this.allRecipe?.length > 0) ? this._dataShared.changeCurrentLoading(false) : true;
      this.allRecipe = this.allRecipe.filter((data) => data.product_locations.length > 0)
      // this.allCategory = this.saveAllCategory.filter((obj) => {
      //   return obj.short_code != 0 && this.allRecipe.some((item) => {
      //     return (item.category != null && obj.id == item.category.id)
      //   })
      // })
      this.getStockValue(this.allRecipe)

    }, () => { }, () => {
      this.loading2 = false;
    })
  }
  FilterLocation(filterValue, Select?: boolean) {
    this.selectedAll = false;
    this.searchValue = '';
    this.selectedSubCategory = false;
    if (filterValue != '*' && Select) {
      this.searchValue = '';
      this.searchValueModel = '';
      this.skuValue = '';
      this.subCategoryValue = '';
      this.ratioValue = undefined;
      this.selectedAll = true
      this.rationCheck = false;
      this.categoryValue = '*'
    }
    let locationName = this.Locations.filter((obj) => {
      // return (filterValue == "null") ? (obj.custom_field1 == null) : (obj.custom_field1 == filterValue)
      let Value;
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
    this.filterValueCopy = filterValue;
    this.allCategoryCopy = JSON.parse(JSON.stringify(this.allCategoryCopy))

    this.allRecipe = this.allCategoryCopy.filter((item) => {
      return item.product_locations.some((location) => {
        return locationName.some(obj => obj.id == location.id)
      })
    })
    this.allRecipe.forEach((obj) => {
      obj.product_variations[0].variations.forEach((item) => {
        item.variation_location_details = item.variation_location_details.filter((item2) => {
          return !(this.location == ' ' || this.location == '*') ? item2.location_id == this.location : true
        })
      })
    })
    // this.allCategory = this.saveAllCategory.filter((obj) => {
    //   return obj.short_code != 0 && this.allRecipe.some((item) => {
    //     return (item.category != null && obj.id == item.category.id)
    //   })
    // })
    this.getStockValue(this.allRecipe)
  }
  getStockValue(Recipes) {
    const merageQuanty = (data) => {
      let result = [];
      let result2 = [];
      var index1 = -1;
      var index2 = -1;
      for (let i = 0; i < data.length; i++) {
        var obj = data[i];
        index1 = result.findIndex(
          (index) => obj.category != null && index.id == obj.category.id);
        index2 = result2.findIndex(
          (index) => obj.sub_category != null && index.id == obj.sub_category.id);
        if (index1 >= 0) {
          // obj.product_variations[0].variations[0].default_sell_price;
          let Stocks = 0
          obj.product_variations[0].variations.forEach(element => {
            Stocks = ((obj.enable_stock != 0 && element.variation_location_details.length > 0) ? element.variation_location_details.reduce((sum, x) => { return sum + Number(x.qty_available) }, 0) : 0);
            result[index1].costPrice += Number(element.dpp_inc_tax) * Stocks;

            result[index1].sellingPrice += Number(element.default_sell_price) * Stocks;

            result[index1].stock += Stocks;
          });
        } else {
          if (obj.category != null) {
            let Stocks = 0;
            let CostPrice = 0;
            let SellingCost = 0;
            obj.product_variations[0].variations.forEach(element => {
              Stocks = (obj.enable_stock != 0 && element.variation_location_details.length > 0) ? element.variation_location_details.reduce((sum, obj) => { return sum + Number(obj.qty_available) }, 0) : 0;
              CostPrice = Number(element.dpp_inc_tax) * Stocks;
              SellingCost = Number(element.default_sell_price) * Stocks;
            });
            result.push({ subCategory: [], id: obj.category.id, category: "category", name: obj.category.name, stock: Stocks, costPrice: CostPrice, sellingPrice: SellingCost });
          }
        }
        if (index2 >= 0) {
          // obj.product_variations[0].variations[0].default_sell_price;
          let Stocks = 0
          obj.product_variations[0].variations.forEach(element => {
            Stocks = (obj.enable_stock != 0 && element.variation_location_details.length > 0) ? element.variation_location_details.reduce((sum, x) => { return sum + Number(x.qty_available) }, 0) : 0;
            result2[index2].stock += Stocks;
            result2[index2].costPrice += Number(element.dpp_inc_tax) * Stocks;
            result2[index2].sellingPrice += Number(element.default_sell_price) * Stocks;

          });
        } else {
          if (obj.sub_category != null) {
            let Stocks = 0;
            let CostPrice = 0;
            let SellingCost = 0;
            obj.product_variations[0].variations.forEach(element => {
              Stocks = (obj.enable_stock != 0 && element.variation_location_details.length > 0) ? element.variation_location_details.reduce((sum, x) => { return sum + Number(x.qty_available) }, 0) : 0;
              CostPrice = Number(element.dpp_inc_tax) * Stocks;
              SellingCost = Number(element.default_sell_price) * Stocks;
            });
            result2.push({ category_id: obj.category.id, id: obj.sub_category.id, category: "sub_category", name: obj.sub_category.name, stock: Stocks, costPrice: CostPrice, sellingPrice: SellingCost });
          }
        }
      }


      result.forEach(element => {
        result2.forEach(element2 => {
          if (element.id == element2.category_id) {
            element.subCategory.push(element2)
          }
        });

      });


      return result;
    };
    this.TotalSum.totalProductSum = 0;
    this.TotalSum.totalSellSum = 0;
    this.TotalSum.totalProfitSum = 0;
    this.TotalSum.totalStock = 0;
    this.TotalSum.totalCostProduct = 0;
    this.TotalSum.totalCostSell = 0;
    this.TotalSum.quantity = 0;
    Recipes.forEach(element => {
      element.product_variations[0].variations.forEach(element2 => {
        let Stocks = 0;
        if (element.category != null && element.enable_stock != 0 && element2.variation_location_details.length > 0) {
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
    this.TotalSum.totalProfitSum = this.TotalSum.totalSellSum - this.TotalSum.totalProductSum;
    this.StockValue = merageQuanty(Recipes);
    this.totalStockCostPrice = 0;
    this.totalStockSellingPrice = 0;
    this.totalStock = 0;
    this.StockValue.forEach(element => {
      if (element.category == 'category') {
        this.totalStock += element.stock;
        this.totalStockCostPrice += element.costPrice;
        this.totalStockSellingPrice += element.sellingPrice
      }

    });
  }
  ToggleSub(eventInfo: any) {
    $(eventInfo.target).parents('table').find("#subCategory").slideToggle('3000')
  }
  RatioFilter(event) {
    this.rationCheck = true;
    this.ratioValue = event;

    this.allCategoryCopy = JSON.parse(JSON.stringify(this.allCategoryCopy))
    if (this.ratioValue != undefined && this.ratioValue.checked) {
      this.allRecipe = this.allCategoryCopy.filter((obj) => {
        return obj.product_variations[0].variations.some((item) => {
          return ((item.dpp_inc_tax / item.default_sell_price) * 100) > 50
        })
      })

    }
    else {
      this.allRecipe = this.allCategoryCopy
    }


    // this.filterAllData(this.searchValue, this.categoryValue, this.subCategoryValue, this.ratioValue)
  }
  sellFilter(event) {

    this.sellCheck = event.checked
  }
  CategoryCheck(event) {
    this.CategoryCheckValue = event.checked;
    // if(!this.CategoryCheckValue)
    // {
    //   $("#subCategory").slideToggle('3000')
    // }
  }
  categoryOptions(value) {
    this.categoryValue = value;
    this.selectedSubCategory = false;
    this.subCategoryValue = ''
    // this.filterAllData(this.searchValue, this.categoryValue, this.subCategoryValue, this.ratioValue) if (category != 'sub') {
    this.allRecipe = [];
    this.perPage = "50"
    if (this.categoryValue != "*") {
      let myCategory = JSON.parse(this.categoryValue)
      this.category = myCategory;
      this.categoryValue = this.category.id
      this.getRecipeByScroll(this.perPage, 1, this.categoryValue, this.subCategoryValue, this.location, this.searchValue, this.skuValue)
      this.selectedSubCategory = true
    }
    else {
      this.categoryValue = '';
      this.category = '*'
      this.getRecipeByScroll(this.perPage, 1, '', '', this.location, this.searchValue, this.skuValue)
    }


  }
  subCategoryOptions(value) {
    this.subCategoryValue = value;
    this.allRecipe = [];
    this.perPage = "50"
    if (this.subCategoryValue != "") {
      this.getRecipeByScroll(this.perPage, 1, this.categoryValue, this.subCategoryValue, this.location, this.searchValue, this.skuValue)
    }
    else {
      this.subCategoryValue = '';
      this.getRecipeByScroll(this.perPage, 1, '', '', this.location, this.searchValue, this.skuValue)
    }
    // this.filterAllData(this.searchValue, 'sub', this.subCategoryValue, this.ratioValue)

  }
  search(value) {

    this.allRecipe = [];
    this.perPage = "50"
    if (value.toLowerCase().includes("sku") || /^\d+$/.test(value)) {
      this.skuValue = value;
      this.searchValue = "";
      this.getRecipeByScroll(this.perPage, 1, this.categoryValue, this.subCategoryValue, this.location, this.searchValue, this.skuValue)
    }
    else {
      this.skuValue = '';
      this.searchValue = value;
      this.getRecipeByScroll(this.perPage, 1, this.categoryValue, this.subCategoryValue, this.location, this.searchValue, this.skuValue)
    }



    // this.allRecipe = [];
    // this.getRecipeByScroll(1, this.categoryValue, this.location, this.searchValue, this.skuValue)


    // this.filterAllData(this.searchValue, this.categoryValue, this.subCategoryValue, this.ratioValue)

  }
  filterAllData(searchValue, category, subCategory, Ratio) {
    this.selectedAll = false;
    this.FilterLocation(this.filterValueCopy)
    if (searchValue != '') {
      this.allRecipe = this.allRecipe.filter((obj) => {
        if (obj.product_custom_field1 != null) {
          return (obj.name.toLowerCase().includes(searchValue.toLowerCase()) || obj.product_custom_field1.toLowerCase().includes(searchValue.toLowerCase()) || obj.sku.toLowerCase().includes(searchValue.toLowerCase()))
        }
        else {
          return (obj.name.toLowerCase().includes(searchValue.toLowerCase()) || obj.sku.toLowerCase().includes(searchValue.toLowerCase()))
        }
      })
    }
    if (category != 'sub') {

      if (category != "*") {
        let myCategory = JSON.parse(category)
        this.category = myCategory;
        this.allRecipe = this.allRecipe.filter((obj) => {
          return (obj.category != null) && (obj.category.id == myCategory.id)
        })
      }
    }
    else {
      if (category != "*") {
        let myCategory = JSON.parse(this.categoryValue)
        this.allRecipe = this.allRecipe.filter((obj) => {
          return (obj.category != null) && (obj.category.id == myCategory.id)
        })
      }
    }
    if (category != "*") {
      this.selectedSubCategory = true
    }
    if (subCategory != "*") {

      this.allRecipe = this.allRecipe.filter((obj) => {
        if (obj.sub_category != null) {
          this.SubCategory_name = obj.sub_category.name
          return (obj.sub_category.id == subCategory);
        }
      })
    }
    if (Ratio != undefined && Ratio.checked) {
      this.allRecipe = this.allRecipe.filter((obj) => {
        return obj.product_variations[0].variations.some((item) => {
          return ((item.dpp_inc_tax / item.default_sell_price) * 100) > 50
        })
      })

    }
  }
  //get Select Option
  selectOption(location) {
    // this.selectedOption.next(location);
    this.selectedAll = false;
    this.searchValueModel = '';
    this.searchValue = '';
    this.skuValue = '';
    this.subCategoryValue = '';
    if (location != ' ' || location != '*') {
      this.selectedAll = true;
      this.filterValueCopy = '*'
    }
    this.rationCheck = false;
    this.location = location;
    this.selectedAll = true;
    this.selectedSubCategory = false;
    this.category = null
    this.location_name = this.Locations.filter((obj) => obj.id == location)[0]?.name;
    this.allRecipe = [];
    this.perPage = "50"
    this.getRecipeByScroll(this.perPage, 1, '', '', this.location, this.searchValue, this.skuValue)
    // this.getAllRecipe(this.location)
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
          result[index1].qunt += obj.quantity;
        } else {
          result.push({ id: obj.product_id, qunt: obj.quantity, variation_id: obj.variation_id, unit_price: obj.unit_price });
        }
      }

      return result;
    };
    let data5 = [];
    sells.forEach((element) => {
      data5.push(...element.sell_lines);
    });
    this.orderQuantity = merageQuanty(data5);
    this.load.next(true);
  }
  getCategory() {
    this._RecipeService.getCategory().subscribe((data) => {
      this.allCategory = data.data
      this.allCategory = this.allCategory.filter((obj) => {
        return obj.short_code != 0
      })
      this.saveAllCategory = this.allCategory
    })
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
          this.getRecipeByScroll()
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
  ngOnInit(): void {

    $(window).scroll(() => {
      $(".table .head1").css("top", $("nav").outerHeight() - 2)
      if ($(window).scrollTop() == $(document).height() - $(window).height() && this.metaRecipe != undefined && this.metaRecipe.current_page < this.metaRecipe.last_page) {
        this.perPage = "50"
        this.getRecipeByScroll(this.perPage, this.metaRecipe.current_page + 1, this.categoryValue, this.subCategoryValue, this.location, this.searchValue, this.skuValue)
      }

      if ($(window).scrollTop() == $(document).height() - $(window).height() && this.metaRecipe != undefined && this.metaRecipe.current_page == this.metaRecipe.last_page) {
        $('#liveToast').toast('show')
      }
      if ($(window).scrollTop() < $(document).height() - $(window).height()) {
        $('#liveToast').toast('hide')
      }
    });


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
