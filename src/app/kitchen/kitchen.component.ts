import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { SharedService } from '../dataShared';
import { KitchenService } from '../kitchen.service';
import { Lang } from '../lang';
import { LangAr } from '../langAr';
import { LangEn } from '../langEn';
import { RecipeService } from '../recipe.service';
declare let $: any;
@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css'],
})

export class KitchenComponent implements OnInit, AfterViewInit {
  public sells: any[];
  public sellsKitchen: any[];
  public sellsMarged: any[];
  public product: any[];
  public variations: any[];
  public category: any[];
  public subCategory: any[];
  public taxs: any[];
  public roleNumber: string = "";
  public logSrc: string = "";
  public typeStatus: string = "delivered";
  public functionalityDiv: boolean = false;
  public checkKitchen: boolean = false;
  public userData: any = {};
  public startDate: any;
  public endDate: any;
  public _langChange: any;
  public today: string;
  public locationId: string;
  public locationName: string;
  public loading: boolean = false;
  public ThrowId: any[] = [];
  public TimeSelect = new Subject<string>();
  public Locations: any;
  public LocationsChoose: string = '*';

  public shipping_statusCheck: string;
  public shipping_status: string = 'ordered';
  public sellsLoaded: Promise<boolean>;
  public sellsKitchenLoaded: Promise<boolean>;
  public load = new Subject<boolean>();
  @ViewChild('grid') public grid: ElementRef;
  @ViewChild('grid2') public grid2: ElementRef;
  @ViewChild('table3') public table3: ElementRef;
  @ViewChild('audio') public audio: ElementRef;
  @ViewChildren('gridItem') public gridItem: QueryList<ElementRef>;
  @ViewChildren('gridItem2') public gridItem2: QueryList<ElementRef>;
  @ViewChildren('sellName') public sellName: QueryList<ElementRef>;
  lang: string;
  LastData: any = [];
  fristTime: number;
  lastType: string;
  TotalPending: any;
  TotalOrdered: any;
  TotalDelrivered: any;
  TotalPacked: any;
  TotalCancelled: any;
  toggle: any;
  totalSells: number;
  orderByGuest: any[];
  orderByCashier: any[];
  orderByStaff: any[];
  orderQuantity: any = [];
  sellPayments: any;
  public checkedData: any = [];
  public totalAmount: number = 0;
  public totalBeforTax: number = 0;
  public discount_amount: number = 0;
  public total3: number = 0;
  public total4: number = 0;
  cancleId: any;
  Totalktitchen2: number;
  checkCorrect: boolean;
  invoiceNoUrl: any = "";

  constructor(private _authService: AuthService, public _KitchenService: KitchenService, private _dataShared: SharedService,
    private _RecipeService: RecipeService,
    private _router: Router,
    public datepipe: DatePipe, private sanitizer: DomSanitizer,) {

    this._dataShared.changeCurrentLoading(true)
    this._langChange = LangEn;
    let date1 = new Date();
    let date = date1.toLocaleString('en', { timeZone: 'Africa/Cairo' });
    this.endDate = '';
    this.startDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.TimeSelect.next(this.startDate);
    this._router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects
        ) {
          localStorage.setItem("path", "kitchen")
          this._router.navigate(['/admin']);
        }
      })

  }
  ngOnInit(): void {
    this.logSrc = environment.logSrc;
    this._dataShared.langVar.subscribe((id) => (this._langChange = id));
    this._langChange = LangEn;
    this.getSellItemsFromSocket()
    this.sellDeleteFromSocket()
    this.userDataInfo()
    if (this._authService.getUserLanguage() == 'ar') {
      Lang.changeDirection('rtl');
      this._langChange = LangAr;
    } else {
      this._langChange = LangEn;
    }
  }
  ngAfterViewInit(): void {
    if (localStorage.getItem('throwData') != null && this.ThrowId.length == 0) {
      this.ThrowId = JSON.parse(localStorage.getItem('throwData'));
      this.sellName.changes.subscribe(() => {
        this.ThrowId.forEach((element) => {
          this.sellName.toArray().find((elm) => {
            if (elm.nativeElement.id == element) {
              $(elm.nativeElement)
                .closest('div')
                .css({ 'text-decoration': 'line-through', opacity: '0.5' });
            }
          });
        });
      });
    }
    // Load Grid Masonry
    this.load.subscribe((data) => {
      this.gridItem.changes.subscribe((e) => {
        this._dataShared.langVar2.subscribe((id) => {
          let changeMasonry = false;
          this.lang = id;
          if (this.lang == '') {
            this.lang = this._authService.getUserLanguage();
          }
          if (this.lang == 'en') {
            changeMasonry = true;
          } else {
            changeMasonry = false;
          }
          if (data) {
            $('.grid').masonry({
              gutter: 0,
              itemSelector: '.grid-item',
              originLeft: changeMasonry,
            });
          }
        });
      });
      this.gridItem2.changes.subscribe((e) => {
        this._dataShared.langVar2.subscribe((id) => {
          let changeMasonry = false;
          this.lang = id;

          if (this.lang == '') {
            this.lang = this._authService.getUserLanguage();
          }
          if (this.lang == 'en') {
            changeMasonry = true;
          } else {
            changeMasonry = false;
          }
          if (data) {
            $('.grid2').masonry({
              gutter: 0,
              itemSelector: '.grid-item2',
              originLeft: changeMasonry,
            });
          }
        });
      });
    });


  }

  getSells(type = 'ordered', time: any, time2: any, mylocation) {
    this.loading = true;
    this._KitchenService.getSells(time, time2)?.subscribe((data) => {
      this.load.next(false);
      this.sellsLoaded = Promise.resolve(false);
      this._dataShared.changeCurrentLoading(false)
      this.sells = data.data
      this.product = data.products
      this.variations = data.variations
      this.category = data.categories
      this.subCategory = data.sub_categories
      this.taxs = data.taxes;
      if (!this.functionalityDiv) {
        this.DisplaySells(this.sells, type, mylocation)
        if (this.roleNumber == '1' || this.roleNumber == '2' || this.roleNumber == '6' || this.roleNumber == '9' || this.roleNumber == '10') {
          this.FilterLocation('R')
        }
      }
      else {
        this.Functionality(type, mylocation, this.sells)
      }

      this.shipping_statusCheck = type

    })
  }
  sellDeleteFromSocket() {
    this._KitchenService.sellDeleteFromSocket().subscribe((data) => {
      let indexOf = this.sells.findIndex((datasell: any) => { return data.transaction_id == datasell.id })
      if (indexOf != -1) {
        this.sells.splice(indexOf, 1)
      }
      this.audio.nativeElement.play();
      this.DisplaySells(this.sells, this.shipping_statusCheck, this.locationName)
    })
  }
  getSellItemsFromSocket() {
    this._KitchenService.sellItemsFromSocket().subscribe((data) => {
      this.load.next(false);
      this.sellsLoaded = Promise.resolve(false);
      this.audio.nativeElement.play();
      data.data.forEach(element => {
        let indexOf = this.sells.findIndex((datasell: any) => { return element.id == datasell.id })
        if (indexOf == -1) {
          this.sells.push(element)
        }
        else {
          this.sells[indexOf] = element
        }
      });
      data.products.forEach(element => {
        let indexOf = this.product.findIndex((data) => { element.id == data.id })
        if (indexOf == -1) {
          this.product.push(element)
        }
      });

      data.variations.forEach(element => {
        let indexOf = this.variations.findIndex((data) => { element.id == data.id })
        if (indexOf == -1) {
          this.variations.push(element)
        }
      });

      data.taxes.forEach(element => {
        let indexOf = this.taxs.findIndex((data) => { element.id == data.id })
        if (indexOf == -1) {
          this.taxs.push(element)
        }
      });

      data.sub_categories.forEach(element => {
        let indexOf = this.subCategory.findIndex((data) => { element.id == data.id })
        if (indexOf == -1) {
          this.subCategory.push(element)
        }
      });

      data.categories.forEach(element => {
        let indexOf = this.category.findIndex((data) => { element.id == data.id })
        if (indexOf == -1) {
          this.category.push(element)
        }
      });

      if (this.functionalityDiv) {
        this.Functionality(this.sells, this.locationName, this.sells)
      }
      else {

        this.DisplaySells(this.sells, this.shipping_statusCheck, this.locationName)
      }

    })
  }
  DisplaySells(sells, type, mylocation) {
    this.lastType = type;
    if (
      this.LastData.length != sells.length &&
      this.fristTime != 0
    ) {
      this.audio.nativeElement.play();
    } else {
      this.fristTime = 1;
    }
    this.LastData = sells;

    type = this.lastType;
    if (type == 'ordered') {
      this.shipping_status = 'packed';
    } else if (type == 'packed') {
      this.shipping_status = 'delivered';
    } else if (type == 'delivered') {
      this.shipping_status = 'delivered';
    } else if (type == 'null') {
      type = null;
      this.shipping_status = 'ordered';
    }
    let sellsCopy = [];
    this.typeStatus = type;
    if (typeof (mylocation) != 'string') {
      sellsCopy = sells.filter((item) => {
        return !item.invoice_no.startsWith("FB") && mylocation.some(obj => obj.id == item.location_id)
      })

    }
    else {
      sellsCopy = sells.filter((item) => {
        return !item.invoice_no.startsWith("FB") && mylocation == item.location_id
      })
    }
    this.sellPayments = this.meragePayments(sellsCopy);
    this.calcTax(this.sellPayments)
    this.CalcKitchen2(sells)
    this.TotalPending = this.getTotalType(null, sellsCopy)
    this.TotalOrdered = this.getTotalType('ordered', sellsCopy)
    this.TotalPacked = this.getTotalType('packed', sellsCopy)
    this.TotalDelrivered = this.getTotalType('delivered', sellsCopy)
    this.orderByGuest = sellsCopy.filter(
      (obj) => obj.staff_note === 'order by guest'
    );
    this.orderByCashier = sellsCopy.filter(
      (obj) => obj.staff_note === null
    );
    this.orderByStaff = sellsCopy.filter(
      (obj) => obj.staff_note != 'order by guest' && obj.staff_note != null
    );
    this.totalSells = sellsCopy.length
    this.TotalCancelled = sellsCopy.length - (this.TotalPending + this.TotalOrdered + this.TotalPacked + this.TotalDelrivered);
    sellsCopy = sellsCopy.filter((obj) => {
      return obj.sell_lines.some(function (item) {
        return (
          item.product_id != environment.voidInvoiceId &&
          obj.shipping_status == type
        );
      });
    });

    let result = [];
    sellsCopy.forEach((element) => {
      var index1;
      var obj = element;
      index1 = result.findIndex(
        (index) => index.res_table_name == obj.res_table_name
      );
      if (index1 >= 0) {
        result[index1].data.push(obj)
      } else {
        result.push({ res_table_name: obj.res_table_name, data: [obj] });
      }

    })

    // result = result.sort((a, b) => a.res_table_name - b.res_table_name)


    this.orderQuantity = [];
    let data5 = [];
    sellsCopy.forEach((element) => {
      data5.push(...element.sell_lines);
    });
    this.orderQuantity = this.merageQuanty(data5);

    this.sellsMarged = result;
    this.loading = false
    this.load.next(true);
    this.sellsLoaded = Promise.resolve(true);
  }
  Functionality(event, locations, sells) {
    $('.aside-item').removeClass('active');
    $(`#kitchen2`).addClass('active');
    this.functionalityDiv = true;
    this.orderQuantity = [];
    this.sellPayments = [];

    if (
      this.LastData.length != sells.length &&
      this.fristTime != 0
    ) {
      this.audio.nativeElement.play();
    } else {
      this.fristTime = 1;
    }
    this.LastData = sells;
    this.sellsKitchenLoaded = Promise.resolve(true);
    if (typeof (locations) != 'string') {
      this.sellsKitchen = sells.filter((item) => {
        return locations.some(obj => obj.id == item.location_id)
      })
    }
    else {
      this.sellsKitchen = sells.filter((item) => {
        return locations == item.location_id
      })
    }
    this.CalcKitchen2(sells)
    // this.sellsKitchenCopy = this.sellsKitchen; 
    this.Totalktitchen2 = this.sellsKitchen.length
    for (let i = 0; i < this.sellsKitchen.length; i++) {
      let temp: any = [];
      for (let j = 0; j < this.sellsKitchen[i].sell_lines.length; j++) {
        if (this.sellsKitchen[i].sell_lines[j].children_type != "combo") {
          temp.push({ ...this.sellsKitchen[i].sell_lines[j] });
        }
      }
      this.sellsKitchen[i].sell_lines = temp;
    }
    this.totalSells = this.sellsKitchen.length;
    let data5 = [];
    this.sellsKitchen.forEach((element) => {
      data5.push(...element.sell_lines);
    });
    this.orderQuantity = this.merageQuanty(data5);
    this.sellPayments = this.meragePayments(this.sellsKitchen);
    this.calcTax(this.sellPayments)
  }
  CalcKitchen2(sells) {
    let time = new Date()
    let date = time.toLocaleString('en', { timeZone: 'Africa/Cairo' });
    let todayTime = this.datepipe.transform(date, 'yyyy-MM-dd');
    if (this.roleNumber == '1' || this.roleNumber == '2' || this.roleNumber == '6' || this.roleNumber == '9' || this.roleNumber == '10') {
      this.sellsKitchen = sells.filter((obj) => {
        let transaction_date = this.datepipe.transform(obj.transaction_date, 'yyyy-MM-dd');
        return (obj.invoice_no.startsWith("FB") || obj.invoice_no.startsWith("Banquet")) && obj.sell_lines.some(function (item) {
          return (
            item.product_id != environment.voidInvoiceId && transaction_date >= todayTime
          );
        });
      });
    }
    else if (this.roleNumber == '3' || this.roleNumber == '4' || this.roleNumber == '5') {
      this.sellsKitchen = sells.filter((obj) => {
        let transaction_date = this.datepipe.transform(obj.transaction_date, 'yyyy-MM-dd');
        return obj.invoice_no.startsWith("FB") && obj.sell_lines.some(function (item) {
          return (
            item.product_id != environment.voidInvoiceId && transaction_date >= todayTime
          );
        });
      });
    }
    else if (this.roleNumber == '11' || this.roleNumber == '12' || this.roleNumber == '13' || this.roleNumber == '14') {
      this.sellsKitchen = sells.filter((obj) => {
        let transaction_date = this.datepipe.transform(obj.transaction_date, 'yyyy-MM-dd');
        return obj.invoice_no.startsWith("Banquet") && obj.sell_lines.some(function (item) {
          return (
            item.product_id != environment.voidInvoiceId && transaction_date >= todayTime
          );
        });
      });
    }
    this.sellsKitchen.sort((a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime());
    // this.sellsKitchenCopy = this.sellsKitchen; 
    this.Totalktitchen2 = this.sellsKitchen.length
  }
  calcTax(sellPayments) {
    this.totalAmount = 0;
    this.total3 = 0;
    this.total4 = 0;
    this.totalBeforTax = 0;
    this.discount_amount = 0;
    sellPayments.forEach((element) => {
      this.totalBeforTax += Number(element.totalBeforTax);
      this.discount_amount += Number(element.discount_amount);
      this.total3 += Number(element.total3);
      this.total4 += Number(element.total4);
    });
    this.totalAmount =
      this.totalBeforTax +
      this.total3 +
      this.total4 -
      this.discount_amount;
  }
  //merge Quantity Data
  merageQuanty(data) {
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
        result.push({ id: obj.product_id, qunt: obj.quantity, variation_id: obj.variation_id });
      }
    }
    return result;
  };
  meragePayments(data) {
    let result = [];
    var index1;
    for (let i = 0; i < data.length; i++) {
      var obj = data[i];
      index1 =
        obj.payment_status == 'due' ||
          obj.payment_lines[0] == undefined
          ? result.findIndex((index) => index.type == 'credit')
          : result.findIndex(
            (index) => index.type == obj.payment_lines[0].method
          );
      if (index1 >= 0 && obj.payment_status == 'due') {
        result[index1].amount += Number(obj.final_total);
        result[index1].totalBeforTax += Number(obj.total_before_tax);
        result[index1].discount_amount +=
          obj.discount_type == 'fixed'
            ? Number(obj.discount_amount)
            : Number(obj.discount_amount) != 0
              ? Number(obj.total_before_tax) *
              Number(obj.discount_amount / 100)
              : Number(obj.discount_amount);
        result[index1].total3 +=
          obj.tax_id == environment.service15 ? Number(obj.tax_amount) : 0;
        result[index1].total4 +=
          obj.tax_id == environment.service25 ? Number(obj.tax_amount) : 0;
      } else if (obj.payment_status == 'due') {
        result.push({
          type: 'credit',
          amount: Number(obj.final_total),
          totalBeforTax: Number(obj.total_before_tax),
          discount_amount:
            obj.discount_type == 'fixed'
              ? Number(obj.discount_amount)
              : Number(obj.discount_amount) != 0
                ? Number(obj.total_before_tax) *
                Number(obj.discount_amount / 100)
                : Number(obj.discount_amount),
          total3: obj.tax_id == environment.service15 ? Number(obj.tax_amount) : 0,
          total4: obj.tax_id == environment.service25 ? Number(obj.tax_amount) : 0,
        });
      }
      if (
        index1 >= 0 &&
        obj.payment_status == 'paid' &&
        obj.payment_lines[0] != undefined
      ) {
        result[index1].amount += Number(obj.final_total);
        result[index1].totalBeforTax += Number(obj.total_before_tax);
        result[index1].discount_amount +=
          obj.discount_type == 'fixed'
            ? Number(obj.discount_amount)
            : Number(obj.discount_amount) != 0
              ? Number(obj.total_before_tax) *
              Number(obj.discount_amount / 100)
              : Number(obj.discount_amount);
        result[index1].total3 +=
          obj.tax_id == environment.service15 ? Number(obj.tax_amount) : 0;
        result[index1].total4 +=
          obj.tax_id == environment.service25 ? Number(obj.tax_amount) : 0;
      } else if (
        obj.payment_status == 'paid' &&
        obj.payment_lines[0] != undefined
      ) {
        result.push({
          type: obj.payment_lines[0].method,
          amount: Number(obj.final_total),
          totalBeforTax: Number(obj.total_before_tax),
          discount_amount:
            obj.discount_type == 'fixed'
              ? Number(obj.discount_amount)
              : Number(obj.discount_amount) != 0
                ? Number(obj.total_before_tax) *
                Number(obj.discount_amount / 100)
                : Number(obj.discount_amount),
          total3: obj.tax_id == environment.service15 ? Number(obj.tax_amount) : 0,
          total4: obj.tax_id == environment.service25 ? Number(obj.tax_amount) : 0,
        });
      }
    }
    return result;
  };

  getTotalType(type, sells) {
    return sells.filter(
      (obj) => {
        return obj.sell_lines.some(function (item) {
          return (
            item.product_id != environment.voidInvoiceId &&
            obj.shipping_status == type
          );
        });
      }
    ).length;
  }
  // listCheck
  listCheck(checkedData) {
    this.checkedData = JSON.parse(checkedData)
  }
  // Cancle Order
  cancleOrder(id) {
    this.cancleId = id;
  }
  confirmCancel() {
    let shippingDetails = this.sells;
    let shippingdetail;
    let date = new Date();
    let date1 = date.toLocaleString('en', { timeZone: 'Africa/Cairo' });
    let latest_date = this.datepipe.transform(date1, 'hh:mm');
    shippingDetails = this.sells.filter((obj) => obj.id == this.cancleId);
    if (shippingDetails[0].delivered_to == null) {
      shippingdetail = '';
    } else {
      shippingdetail = `${shippingDetails[0].delivered_to},`;
    }
    shippingdetail += `cancelled by ${this.userData.name} @(${latest_date})`;
    var body = {
      shipping_status: 'cancelled',
      delivered_to: shippingdetail,
      sale_note: shippingDetails[0].staff_note,
      products: [
        {
          product_id: environment.voidInvoiceId,
          variation_id: environment.voidInvoiceId,
          quantity: 1,
          unit_price: 0,
        }
      ],
    };
    this._RecipeService.cancleOrder(body, this.cancleId).subscribe(
      (data) => { },
      () => { },
      () => {
        $('#deleteOrder').modal('hide');
      }
    );
  }
  FilterLocation(filterValue) {

    let Locations = this.Locations.filter((obj) => {
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
    this.locationName = Locations
    this.DisplaySells(this.sells, this.shipping_statusCheck, this.locationName)
  }
  // Throw Line in order
  throwElement(event, event2) {
    let index = this.ThrowId.indexOf(event2);
    if (!this.toggle) {
      $(event.target)
        .closest('div')
        .css({ 'text-decoration': 'line-through', opacity: '0.5' });
      this.toggle = !this.toggle;
      !(index > -1) ? this.ThrowId.push(event2) : '';
    } else {
      $(event.target)
        .closest('div')
        .css({ 'text-decoration': 'none', opacity: '1' });

      index > -1 ? this.ThrowId.splice(index, 1) : '';
      this.toggle = !this.toggle;
    }
    localStorage.setItem('throwData', JSON.stringify(this.ThrowId));
  }
  selectOption(location) {
    this.LocationsChoose = location
    if (location == '*') {
      this.locationName = this.Locations
    }
    else {
      this.locationName = location
    }
    this.DisplaySells(this.sells, this.shipping_statusCheck, this.locationName)
  }
  selectTime(time) {
    let date = new Date();
    let date1 = date.toLocaleString('en', { timeZone: 'Africa/Cairo' });
    if (time == 'today') {
      this.startDate = this.datepipe.transform(date1, 'yyyy-MM-dd');
      this.endDate = '';
      this.getSells(this.shipping_statusCheck, this.startDate, this.endDate, this.locationName)

    } else {
      let date13 = new Date(date1).setDate(new Date(date1).getDate() - 1);
      this.startDate = this.datepipe.transform(date13, 'yyyy-MM-dd');
      this.endDate = this.datepipe.transform(date13, 'yyyy-MM-dd');
      this.getSells(this.shipping_statusCheck, this.startDate, this.endDate, this.locationName)
    }
  }

  userDataInfo() {
    this._dataShared.currentallUsers.subscribe((data) => {
      if (data) {
        this.userData = data;
        if (this.userData) {
          this.roleNumber = this.userData.role;
          if (this.userData.locations.length > 1) {
            this.locationId = ' '
          }
          if (this.roleNumber == '1' || this.roleNumber == '2' || this.roleNumber == '6' || this.roleNumber == '9' || this.roleNumber == '10') {
            this.shipping_statusCheck = 'delivered';
            this.getSells('delivered', this.startDate, this.endDate, this.userData.locations)
          } else if (this.roleNumber == '3' || this.roleNumber == '4') {
            this.getSells('null', this.startDate, this.endDate, this.userData.locations)
            this.shipping_statusCheck = 'null';
          } else if (this.roleNumber == '5') {
            this.getSells('ordered', this.startDate, this.endDate, this.userData.locations)
            this.shipping_statusCheck = 'ordered';
          }
          this.Locations = this.userData.locations;
          this.locationName = this.Locations
        }
      }
    })
  }
  logOut() {
    this._KitchenService.logOut().subscribe((data) => {
      if (data.success) {
        this._dataShared.changeRoles(null);
        this._router.navigate(['/admin']);
        this._KitchenService.token.next(null)
        localStorage.clear()
      }
    })
  }
  // Change Shipping Status in front
  onChangeShipping(event, type) {
    this.shipping_statusCheck = type;
    this.DisplaySells(this.sells, type, this.locationName)
    $('.aside-item').removeClass('active');
    $(`#${type}`).addClass('active');
    this.functionalityDiv = false;
  }
  // Change Order Status
  changeStatus(sell: any, type) {
    // let shippingDetails = (!this.functionalityDiv) ? this.sells : this.sellsKitchen;
    let date = new Date();
    let date1 = date.toLocaleString('en', { timeZone: 'Africa/Cairo' });
    let latest_date = this.datepipe.transform(date1, 'yyyy-MM-dd HH:mm:ss');
    let shippingdetail;
    let data = ""
    let shippingDetails = sell
    if (shippingDetails.delivered_to == null) {
      shippingdetail = [];
    } else {
      shippingdetail = JSON.parse(shippingDetails.delivered_to);
      let index = shippingdetail.findIndex((obj) => this.userData.name == obj.name && type == obj.type)
      if (index != -1) {
        shippingdetail[index].time = latest_date
      }
      else {
        shippingdetail.push({ name: this.userData.name, time: latest_date, type: type });
      }
    }
    if (shippingdetail.length == 0) {
      shippingdetail.push({ name: this.userData.name, time: latest_date, type: type });
    }
    data = JSON.stringify(shippingdetail)
    // }
    let body = {
      id: sell.id,
      shipping_status: type,
      delivered_to: data,
    };
    this._KitchenService.changeStatus(body).subscribe(
      () => { },
      () => { },
    );
  }

  // Check if Exist Throw Data in Local Storage
  localCheck() {
    if (localStorage.getItem('throwData') != null) {
      this.ThrowId = JSON.parse(localStorage.getItem('throwData'));
      this.sellName.changes.subscribe(() => {
        this.ThrowId.forEach((element) => {
          this.sellName.toArray().find((elm) => {
            if (elm.nativeElement.id == element) {
              $(elm.nativeElement)
                .closest('div')
                .css({ 'text-decoration': 'line-through', opacity: '0.5' });
            }
          });
        });
      });
    }
  }
  CheckedCorrect(eventinfo, id, type) {
    this.checkCorrect = true;
    if (type == null) {
      this.changeStatus(id, "ordered");
    }
    else {
      this.changeStatus(id, type);
    }
  }
  invoiceno(url: any = "") {
    this.invoiceNoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
  // Refresh Button To Get New Sell Data
  printData() {
    var divToPrint = document.getElementById("table3");
    let newWin = window.open("");
    newWin.document.write(divToPrint.outerHTML + `<p style="text-align:center;">© Copyright 2020
    <span >${environment.copyright1}</span>
    , Developed By
    ${environment.copyright2}
  </p>`);
    newWin.print();
    newWin.close();
  }

  exportThisWithParameter(tableID: any, excelName: any) {
    var uri = 'data:application/vnd.ms-excel;base64,',
      template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"  xmlns="http://www.w3.org/TR/REC-html40"><head> <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets> <x:ExcelWorksheet><x:Name>{worksheet}</x:Name> <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions> </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook> </xml><![endif]--></head><body> <table>{table}</table>
      <p style="text-align:center;">© Copyright 2020
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
}
