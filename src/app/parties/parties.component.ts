import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RecipeService } from '../recipe.service';
import { AuthService } from '../auth.service';
import { SharedService } from '../dataShared';
import { Lang } from '../lang';
import { LangAr } from '../langAr';
import { LangEn } from '../langEn';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { KitchenService } from '../kitchen.service';
declare let $: any;
@Component({
  selector: 'app-parties',
  templateUrl: './parties.component.html',
  styleUrls: ['./parties.component.css']
})
export class PartiesComponent implements OnInit {
  public sells: any = [];
  public category: any = [];
  public allRecipe: any = [];
  public startDate: any;
  public endDate: any;
  public tables: any;
  public taxs: any;
  public comboCatgory: number;
  public rentalCatgory: number;
  public userData: any;
  public _langChange: any;
  public roleNumber: string;
  public selected: any;
  public alwaysShowCalendars: boolean;
  public showRangeLabelOnInput: boolean;
  public keepCalendarOpeningWithRange: boolean;
  public loading2: boolean = false;
  public groupName: string;
  public location_id;
  public totalFood = [];
  public totalFoodSum = {};
  filtersLoaded: Promise<boolean>;
  @ViewChild('head3') public head3: ElementRef;
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
    // 'last year': [
    //   moment()
    //     .subtract(1, 'year')
    //     .startOf('year'),
    //   moment()
    //     .subtract(1, 'year')
    //     .endOf('year')
    // ]
  };
  public selectedOption = new BehaviorSubject<string>('*');
  constructor(public _KitchenService: KitchenService, private _RecipeService: RecipeService, private _authService: AuthService, private _DatePipe: DatePipe, private _dataShared: SharedService,
    private _router: Router) {
    this._dataShared.changeCurrentLoading(true);
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
          localStorage.setItem("path", "parties")
          this._router.navigate(['/admin']);
        }
      })
    this.getTax()
    this.getAllRecipe();
    this.getTableName();
    this.getCategory();
    this.getAllSell(this.startDate, this.endDate);
  }
  getAllRecipe() {
    this._dataShared.currentallRecipes.subscribe((data) => {
      // this._RecipeService.getRecipes().subscribe((data) => {
      // data.subscribe((data1) => {

      // let dataArray = [];
      // for (let i = 0; i < data1.length; i++) {
      //   dataArray.push(...data1[i].data);
      // }
      this.allRecipe = data;
      (this.allRecipe?.length > 0) ? this._dataShared.changeCurrentLoading(false) : true;
    })
    // })
  }
  getCategory() {
    this._RecipeService.getCategory().subscribe((data) => {
      this.category = data

    })
  }
  getAllSell(start, end) {
    this.loading2 = true;
    this._dataShared.changeCurrentTotalFood({})
    this._RecipeService.getAllSell(start, end, environment.locationParty).subscribe((data) => {
      this.sells = data.data;

      let dataArray2 = [];
      dataArray2 = this.sells;

      let dataArray = dataArray2.filter(
        (obj) => obj.status == "final"
      )
      this.sells = dataArray;
      this.totalFoodSum = {};
      this.totalFood = [];
      this._dataShared.CurrenttotalFood.subscribe((val) => {
        ((this.totalFood.findIndex((obj) => obj.id == val.id)) == -1) ? this.totalFood.push(val) : "";
        this.totalFoodSum = [this.totalFood.reduce((acc, n) => {
          for (var prop in n) {
            if (acc.hasOwnProperty(prop)) acc[prop] += n[prop];
            else acc[prop] = n[prop];
          }
          return acc;
        }, {})]
      })
    }, () => { }, () => {
      this.loading2 = false;
    })

  }
  // Get table numbers
  getTableName() {
    return this._RecipeService.getTableNumber().subscribe((data) => {
      this.tables = data.data;
      this.tables = this.tables.filter((obj) => obj.location_id == environment.locationParty)
    });
  }
  // Get Tax 
  getTax() {
    return this._RecipeService.getTax().subscribe((data) => {
      this.taxs = data.data;
      // this.taxs = this.taxs.filter((obj) => obj.location_id == environment.locationParty)
    });
  }
  printData() {
    var divToPrint = document.getElementById("tableParties");
    let newWin = window.open("");
    newWin.document.write(`<div style="text-align:center"><h1 >Banquet Report</h1><span>${this.startDate}</span> - <span>${this.endDate}</span></div>` + divToPrint.outerHTML + `<p style="text-align:center;">© Copyright 2020
    <span >${environment.copyright1}</span>
    , Developed By
    ${environment.copyright2}
  </p>`);
    newWin.print();
    newWin.close();


  }
  exportThisWithParameter(tableID: any, excelName: any) {
    var uri = 'data:application/vnd.ms-excel;base64,',
      template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"  xmlns="http://www.w3.org/TR/REC-html40"><head> <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets> <x:ExcelWorksheet><x:Name>{worksheet}</x:Name> <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions> </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook> </xml><![endif]--></head><body><div style="text-align:center"><h1 >Banquet Report</h1><span>${this.startDate}</span> - <span>${this.endDate}</span></div> <table>{table}</table>
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
  // Refresh Button To Get New Sell Data
  refreshSell(event) {
    $(event.target).children().toggleClass('down');
    this.getAllSell(this.startDate, this.endDate);
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

        }
      }
    });
  }
  //get Select Option
  selectTime(time) {

    this.startDate = this._DatePipe.transform(time.startDate._d, 'yyyy-MM-dd');
    this.endDate = this._DatePipe.transform(time.endDate._d, 'yyyy-MM-dd');
    this.getAllSell(this.startDate, this.endDate);
    // this.today = time;
  }
  ngOnInit(): void {
    $(window).scroll(function () {
      $(".table .head1").css("top", $("#nav").outerHeight() - 2)
      $(".table .head1").next().css("top", $("#nav").outerHeight() + $(".table .head1").outerHeight());
      let windowtop = $(window).scrollTop();
      if ($(".table .head3") != undefined) {
        let head3 = $(".table .head3").offset().top;
        if (windowtop > head3 - 100) {

          $(".head1,.head2").css("position", "static")
          $(".table .head3").css("position", "sticky")
          $(".table .head3").css("top", $("#nav").outerHeight() - 2)
        }
        else {
          $(".head1,.head2").css("position", "sticky")
          $(".table .head3").css("position", "sticky")

        }
      }
    })
    // $(".table .head1").next().css("top",$("#nav").outerHeight()+$(".table .head1").outerHeight())
    this._dataShared.langVar.subscribe((id) => (this._langChange = id));
    this._langChange = LangEn;

    this.getUserData();

    if (this._authService.getUserLanguage() == 'ar') {
      Lang.changeDirection('rtl');
      this._langChange = LangAr;
    } else {
      this._langChange = LangEn;
    }
    this.comboCatgory = environment.comboProductCategory;
    this.rentalCatgory = environment.partiesRentalCategoryAndSubcategoryID;

  }

  ngAfterViewInit(): void {

  }
}
