import { Component, EventEmitter, OnInit } from '@angular/core';
import { Lang } from '../lang';
import { LangAr } from '../langAr';
import { LangEn } from '../langEn';
import { RecipeService } from '../recipe.service';
import * as moment from 'moment';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SharedService } from '../dataShared';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { BehaviorSubject, pipe } from 'rxjs';
import { NgSelectConfig } from '@ng-select/ng-select';
import { KitchenService } from '../kitchen.service';
declare let $: any;
@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {
  public allRecipe: any = [];
  public allContact: any = [];
  public category: any = [];
  public userData: any;
  public _langChange: any;
  public roleNumber: string;
  public location: string;
  public location_id: string;
  public GeneralMainHouseLocationId: string;
  public FoodBeverageMainWareHouseLocationID: string;
  public selected: any;
  public alwaysShowCalendars: boolean;
  public showRangeLabelOnInput: boolean;
  public keepCalendarOpeningWithRange: boolean;
  public loading2: boolean = false;
  public Alert: boolean = false;
  public success: boolean = false;
  public updatebtn: boolean = false;

  public alertMessage: string = "";
  public sellId: string = "";
  public contactvalue: string = "";
  public successMessage: string = "";
  public startDate: any;
  public endDate: any;
  public timer: any = null;
  public contactID: any = null;
  public selectedCategory: any = null;
  public value: string = "";
  public TypeValue: string = "";
  public LotPrice: string = "";
  public editValueModel: string = "";
  public note: any = null;
  public ProductList: any = [];
  public ProductListObs: BehaviorSubject<any> = new BehaviorSubject([]);
  public lang: string = "en";
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
  peopleTypeahead = new EventEmitter<string>();
  groupByFn = (item) => {
    return (item.product_variations[0].is_dummy == 0) ? "variations" : 'choose'
  };
  constructor(public _KitchenService: KitchenService, private config: NgSelectConfig, private _RecipeService: RecipeService, private _authService: AuthService, private _DatePipe: DatePipe, private _dataShared: SharedService,
    private _router: Router) {
    this.selected = {
      startDate: moment(),
      endDate: moment()
    };
    this.GeneralMainHouseLocationId = environment.GeneralWareHouseLocationID;
    this.FoodBeverageMainWareHouseLocationID = environment.FoodBeverageMainWareHouseLocationID;

    this.getUserData();

    // this.getAllRecipe(this.location_id)
    this.getCategory()
    this.getcontactUser()
    this._router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects
        ) {
          localStorage.setItem("path", "pos")
          this._router.navigate(['/admin']);
        }
      })
  }
  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();

    return item.sku.toLowerCase().indexOf(term) > -1 ||
      item.product_custom_field1?.toLowerCase().indexOf(term) > -1
      ||
      item.name.toLowerCase().indexOf(term) > -1 ||
      (item.sku + " - " + item.name + item.product_custom_field1).toLowerCase().indexOf(term) > -1;


  }
  // Get AllRecipes
  getAllRecipe(location) {
    this.roleNumber = localStorage.getItem("userRo");
    this.loading2 = true;
    if (location != ' ') {
      this.getRecipe(location)
    }
    else {
      if (this.roleNumber == '9') {
        this.getRecipe(environment.FoodBeverageMainWareHouseLocationID)
      }
      else if (this.roleNumber == '15') {
        this.getRecipe(environment.GeneralWareHouseLocationID)
      }
      else {
        this.getRecipe(environment.GeneralWareHouseLocationID)
        this.getRecipe(environment.FoodBeverageMainWareHouseLocationID)
      }
    }

  }
  getRecipe(location) {

    this._RecipeService.getRecipes(location).subscribe((data) => {
      data.subscribe((data1) => {
        let dataArray = [];
        for (let i = 0; i < data1.length; i++) {
          dataArray.push(...data1[i].data);
        }
        this.allRecipe.push(...dataArray);
        (this.allRecipe?.length > 0) ? this._dataShared.changeCurrentLoading(false) : true;
        this.loading2 = false;
      }, () => { }, () => {
      })
    })


  }
  selectEvent(value) {
    let varitionID = value.id;

    if (value && value.name.replace(/\s/g, "") != "") {
      // this.updatebtn = false;
      let alert = false;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        let Index = this.ProductList.findIndex((obj) => obj[4].id == value.id)
        let qty_available;
        this.allRecipe.forEach(element => {
          let sumQnt = 0;
          let indexVariation = element.product_variations[0].variations.findIndex((obj) => obj.id == varitionID)
          if (indexVariation >= 0) {
            qty_available = element.product_variations[0].variations[indexVariation].variation_location_details[0].qty_available;
            sumQnt = element.product_variations[0].variations[indexVariation].variation_location_details[0].lot_details.reduce((total, num) => total + num.qty_available, 0);
          }
          else {
            qty_available = 0
          }

          if (indexVariation >= 0 && Index < 0 && qty_available > 0) {
            this.LotPrice = element.product_variations[0].variations[indexVariation].dpp_inc_tax;
            if (sumQnt == qty_available) {
              this.ProductList.push([element.product_variations[0].variations[indexVariation], { Quantity: 1 }, { lot: element.product_variations[0].variations[indexVariation].variation_location_details[0].lot_details }, { LotPrice: 0 }, { id: varitionID }, { productId: element.product_variations[0].variations[indexVariation].product_id }, { qty_available: 0 }, { note: null }])

            }
            else {
              this.ProductList.push([element.product_variations[0].variations[indexVariation], { Quantity: 1 }, { lot: false }, { LotPrice: this.LotPrice }, { id: varitionID }, { productId: element.product_variations[0].variations[indexVariation].product_id }, { qty_available: qty_available }, { note: this.note }])
            }
            alert = false;
            this.value = ""
          }
        });
        if (alert) {
          this.Alert = true;
          this.alertMessage = "No matching product found!"
          $("#error")[0].play()
          setTimeout(() => {
            this.Alert = false;
          }, 2000);
        }
        if (qty_available <= 0) {
          this.Alert = true;
          this.alertMessage = "Quantity not Available!"
          $("#error")[0].play()
          setTimeout(() => {
            this.Alert = false;
          }, 2000);
        }
        // else {
        //   $("#success")[0].play()
        // }
        if (Index > -1) {
          this.ProductList[Index][1].Quantity = Number(this.ProductList[Index][1].Quantity) + 1
        }
      }, 100);

    }


  }
  selectLot(value, i) {
    let value2 = JSON.parse(value)
    this.ProductList[i][3].LotPrice = value2.dpp_inc_tax
    this.ProductList[i][6].qty_available = value2.qty_available
  }
  onChangeSearch(value: string) {

    debugger;
    if (value) {
      // this.updatebtn = false;
      let alert = true;
      let Variation = true;
      // clearTimeout(this.timer);
      let qty_available;
      // this.timer = setTimeout(() => {
      let Index = this.ProductList.findIndex((obj) => (obj[0].id == value))
      this.allRecipe.forEach(element => {
        let sumQnt = 0;
        if (element.product_variations[0].is_dummy == 1) {

          if (Index < 0 && element.id == value) {
            qty_available = element.product_variations[0].variations[0].variation_location_details[0]?.qty_available
            sumQnt = element.product_variations[0].variations[0].variation_location_details[0].lot_details.reduce((total, num) => total + num.qty_available, 0);

            // && sumQnt == qty_available
            if (qty_available > 0) {
              this.LotPrice = element.product_variations[0].variations[0].dpp_inc_tax;
              this.ProductList.push([element, { Quantity: 1 }, { lot: element.product_variations[0].variations[0].variation_location_details[0].lot_details }, { LotPrice: 0 }, { id: element.product_variations[0].variations[0].id }, { productId: element.id }, { qty_available: 0 }, { note: this.note }])
              alert = false;
              this.value = "";
            }
          }
        }
        else {
          if (element.id == value) {
            this.value = element.product_variations[0].variations;
            alert = false;
          }

        }
      });
      if (Index > -1) {
        alert = false;
        this.value = ""
        this.ProductList[Index][1].Quantity = Number(this.ProductList[Index][1].Quantity) + 1
      }
      if (alert || qty_available <= 0) {
        this.Alert = true;
        this.alertMessage = "No matching product found!"
        $("#error")[0].play()
        setTimeout(() => {
          this.Alert = false;
        }, 2000);
      }
      if (qty_available <= 0) {
        this.Alert = true;
        this.alertMessage = "Quantity not Available!"
        $("#error")[0].play()
        setTimeout(() => {
          this.Alert = false;
        }, 2000);
      }
      // else if (!alert ) {
      //   $("#success")[0].play()
      // }
      this.ProductListObs.next(this.ProductList)
      // }, 100);

    }
  }
  edit(value) {

    this.editValueModel = value;
    this.updatebtn = true;
    this._RecipeService.getAllSell(this.startDate, this.endDate, this.location_id).subscribe((data) => {
      this.ProductList = [];
      let sell = data.data.filter((element) => element.invoice_no.includes(this.editValueModel));

      sell.forEach(sellnote => {
        this.sellId = sellnote.id;
        this.contactvalue = sellnote.contact_id;
        this.startDate = this._DatePipe.transform(sellnote.transaction_date, 'yyyy-MM-dd');
        this.endDate = this._DatePipe.transform(sellnote.transaction_date, 'yyyy-MM-dd');
        this.selected = {
          startDate: moment(this.startDate),
          endDate: moment(this.endDate)
        };
        sellnote.sell_lines.forEach(element2 => {
          this.onChangeSearch(element2.product_id);

          this.ProductListObs.subscribe((d) => {

            if (this.ProductList.length > 0) {
              let index = this.ProductList.findIndex((data) => data[5].productId == element2.product_id)

              if (index >= 0) {
                this.ProductList[index][1].Quantity = element2.quantity;
                this.ProductList[index][3].LotPrice = element2.unit_price_inc_tax;
                this.ProductList[index][7].note = element2.sell_line_note;
              }
            }
          })
        });
      });

    })
  }

  plus(i) {
    this.ProductList[i][1].Quantity = Number(this.ProductList[i][1].Quantity) + 1
  }
  minus(i) {
    this.ProductList[i][1].Quantity = Number(this.ProductList[i][1].Quantity) - 1
  }
  deleteProduct(i) {
    this.ProductList.splice(i, 1);
  }
  // Get All Contect 
  getcontactUser() {
    this._RecipeService.getContact().subscribe((data) => {
      this.allContact = data.data;
      if (this.location_id == environment.GeneralWareHouseLocationID) {
        this.allContact = this.allContact.filter((obj) => obj.custom_field1 == 'M')
      }
      if (this.location_id == environment.FoodBeverageMainWareHouseLocationID || this.roleNumber == '9') {
        this.allContact = this.allContact.filter((obj) => obj.custom_field1 == 'F')
      }
      // else {
      //   this.allContact = this.allContact.filter((obj) => obj.custom_field1 == 'F' || obj.custom_field1 == 'M')
      // }

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
          else {
            this.location_id = this.userData.locations
          }
          this.roleNumber = this.userData.role;
          this.getAllRecipe(this.location_id)
        }
      }
    });
  }

  //get Select Option
  selectTime(time) {
    this.startDate = this._DatePipe.transform(time.startDate._d, 'yyyy-MM-dd');
    this.endDate = this._DatePipe.transform(time.endDate._d, 'yyyy-MM-dd');
  }
  //get Select Option
  selectOption(location) {
    this.location = location;
    this.location_id = location
    // this.getAllRecipe(' ')
    if (location != " ") {
      this.allRecipe = this.allRecipe.filter((obj) => {
        return obj.product_locations.some((item) => item.id == location)
      });
    }
  }
  selectContact(contact) {
    this.contactID = contact
  }
  addSell() {
    let products = [];
    for (let i = 0; i < this.ProductList.length; i++) {
      if (this.location_id == environment.FoodBeverageMainWareHouseLocationID) {
        products.push({
          product_id: this.ProductList[i][5].productId,
          variation_id: this.ProductList[i][4].id,
          quantity: this.ProductList[i][1].Quantity,
          unit_price: Number(this.ProductList[i][3].LotPrice),
        });
      }
      else {
        if (this.ProductList[i][7].note != null) {
          products.push({
            product_id: this.ProductList[i][5].productId,
            variation_id: this.ProductList[i][4].id,
            quantity: this.ProductList[i][1].Quantity,
            unit_price: Number(this.ProductList[i][3].LotPrice),
            note: `${this.ProductList[i][7].note}`
          });
        }

        else {
          this.Alert = true;
          this.alertMessage = "Choose Your Note"
          $("#error")[0].play()
          setTimeout(() => {
            this.Alert = false;
          }, 2000);



        }

      }

    }

    let time = new Date();
    var body = {
      sells: [
        {
          location_id: this.location_id,
          contact_id: this.contactID,
          status: 'final',
          is_suspend: '1',
          transaction_date: `${this.startDate} ${time.getHours()}:${time.getMinutes()}`,
          // tax_rate_id: environment.service15,
          products: products,
          payments: [
            {
              amount: 0,
            },
          ],
        },
      ],
    };
    this._RecipeService.sendCart(body).subscribe((data) => {
      if (data[0].invoice_no != null) {
        this.success = true;
        this.successMessage = `your Invoice ${data[0].invoice_no}`
        $("#success")[0].play()
        setTimeout(() => {
          this.success = false;
        }, 5000);
        this.ProductList = [];
        this.allRecipe = [];
        this.getAllRecipe(this.location_id)
      }
      else {
        this.Alert = true;
        this.alertMessage = "Make Sure Valid Data"
        $("#error")[0].play()
        setTimeout(() => {
          this.Alert = false;
        }, 2000);


      }
    }, (err) => {
      console.log(err)
    });
  }
  updateSell() {
    // cancleOrder
    let products = [];
    for (let i = 0; i < this.ProductList.length; i++) {
      if (this.location_id == environment.FoodBeverageMainWareHouseLocationID) {
        products.push({
          product_id: this.ProductList[i][5].productId,
          variation_id: this.ProductList[i][4].id,
          quantity: this.ProductList[i][1].Quantity,
          unit_price: Number(this.ProductList[i][3].LotPrice),
        });
      }
      else {
        if (this.ProductList[i][7].note != null) {
          products.push({
            product_id: this.ProductList[i][5].productId,
            variation_id: this.ProductList[i][4].id,
            quantity: this.ProductList[i][1].Quantity,
            unit_price: Number(this.ProductList[i][3].LotPrice),
            note: `${this.ProductList[i][7].note}`
          });
        }

        else {
          this.Alert = true;
          this.alertMessage = "Choose Your Note"
          $("#error")[0].play()
          setTimeout(() => {
            this.Alert = false;
          }, 2000);



        }

      }

    }

    let time = new Date();
    var body = {
      location_id: this.location_id,
      contact_id: this.contactID,
      status: 'final',
      is_suspend: '1',
      transaction_date: `${this.startDate} ${time.getHours()}:${time.getMinutes()}`,
      // shipping_status: 'ordered',
      // tax_rate_id: environment.service15,
      products: products,
      payments: [
        {
          amount: 0,
        },
      ],

    }


    this._RecipeService.cancleOrder(body, this.sellId).subscribe((data) => {
      if (data.id != null) {
        this.success = true;
        $("#success")[0].play()
        setTimeout(() => {
          this.success = false;
        }, 5000);
        this.ProductList = [];
        this.edit(null)
        this.updatebtn = false;
        this.selected = {
          startDate: moment(),
          endDate: moment()
        };
      }
      else {
        this.Alert = true;
        this.alertMessage = "Make Sure Valid Data"
        $("#error")[0].play()
        setTimeout(() => {
          this.Alert = false;
        }, 2000);


      }
    }, (err) => {
      console.log(err)
    });
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
  getCategory() {
    this._RecipeService.getCategory(environment.GeneralWareHouseCategory2).subscribe((data) => {
      this.category = (new Function("return [" + (data.data[0].description) + "];")());
    })
  }
  ngOnInit(): void {
    this._dataShared.langVar.subscribe((id) => (this._langChange = id));
    this._langChange = LangEn;
    this._dataShared.langVar2.subscribe((id) => (this.lang = id));
    if (this.lang == '') {
      this.lang = this._authService.getUserLanguage();
    }
    this._langChange = LangEn;

    if (this._authService.getUserLanguage() == 'ar') {
      Lang.changeDirection('rtl');
      this._langChange = LangAr;
    } else {
      this._langChange = LangEn;
    }
  }

}

