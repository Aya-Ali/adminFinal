import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { SharedService } from '../dataShared';
import { RecipeService } from '../recipe.service';
import { environment } from 'src/environments/environment';
import { Lang } from '../lang';
import { LangAr } from '../langAr';
import { LangEn } from '../langEn';
import { KitchenService } from '../kitchen.service';
declare let $: any;
@Component({
  selector: 'app-mw1',
  templateUrl: './mw1.component.html',
  styleUrls: ['./mw1.component.css']
})
export class MW1Component implements OnInit {
  public sells: any = [];
  public Filtersells: any = [];
  public category: any = [];
  public loading2: boolean = false;
  public startDate: any;
  public endDate: any;
  public selected: any;
  public userData: any;
  public _langChange: any;
  public location_id;
  public Total: number = 0;

  public roleNumber: string;
  public alwaysShowCalendars: boolean;
  public showRangeLabelOnInput: boolean;
  public keepCalendarOpeningWithRange: boolean;
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
  constructor(public _KitchenService: KitchenService, private _RecipeService: RecipeService, private _authService: AuthService, private _DatePipe: DatePipe, private _dataShared: SharedService,
    private _router: Router) {
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
          localStorage.setItem("path", "gw1")
          this._router.navigate(['/admin']);
        }
      })
    this.getCategory()
    this.getAllSell(this.startDate, this.endDate);
  }

  ngOnInit(): void {
    this._dataShared.langVar.subscribe((id) => (this._langChange = id));
    this._langChange = LangEn;

      this.getUserData();

   
    if (this._authService.getUserLanguage() == 'ar') {
      Lang.changeDirection('rtl');
      this._langChange = LangAr;
    } else {
      this._langChange = LangEn;
    }
  }
  getAllSell(start, end) {
    this.loading2 = true;
    this._dataShared.changeCurrentTotalFood({})
    this._RecipeService.getAllSell(start, end, environment.GeneralWareHouseLocationID).subscribe((data) => {
      this.sells = data.data;
      (this.sells?.length > 0) ? this._dataShared.changeCurrentLoading(false) : true;
      (this.sells?.length > 0) ? this.filter(this.sells) : ''
    }, () => { }, () => {
      this.loading2 = false;
    })

  }

  filter(sells) {
    // let sells: any = [];
    this.Filtersells = [];

    this.category.forEach(element => {

      if (element.type == 0) {
        sells.forEach(sell => {
          if (sell.contact_id == element.id) {

            let index = this.Filtersells.findIndex((obj) => obj.name == element.name)
            if (index > -1) {
              this.Filtersells[index].cost += Number(sell.final_total)
            }
            else {
              this.Filtersells.push({ name: element.name, cost: Number(sell.final_total) })
            }
          }
        });

      }
      else {
        sells.forEach(sell => {
          if (sell.customer_group_id == element.id) {

            if (sells.length > 0) {
              let index = this.Filtersells.findIndex((obj) => obj.name == element.name)
              if (index > -1) {
                this.Filtersells[index].cost += Number(sell.final_total)
              }
              else {
                this.Filtersells.push({ name: element.name, cost: Number(sell.final_total) })
              }
            }
          }

        });
      }
    });


    this.Total = this.Filtersells.reduce((sum, obj) => { return sum += obj.cost }, 0)


  }
  //get Select Option
  selectTime(time) {

    this.startDate = this._DatePipe.transform(time.startDate._d, 'yyyy-MM-dd');
    this.endDate = this._DatePipe.transform(time.endDate._d, 'yyyy-MM-dd');
    this.getAllSell(this.startDate, this.endDate);
    // this.today = time;
  }
  getCategory() {
    this._RecipeService.getCategory(environment.GeneralWareHouseCategory1).subscribe((data) => {

      this.category = (new Function("return [" + (data.data[0].description) + "];")());
    })
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
  printData() {
    var divToPrint = document.getElementById("tableMW1");
    let newWin = window.open("");
    newWin.document.write(`<div style="text-align:center"><h1 >${this._langChange.mw1}</h1><span>${this.startDate}</span> - <span>${this.endDate}</span></div>` + divToPrint.outerHTML + `<p style="text-align:center;">© Copyright 2020
    <span >${environment.copyright1}</span>
    , Developed By
    ${environment.copyright2}
  </p>`);
    newWin.print();
    newWin.close();


  }
  exportThisWithParameter(tableID: any, excelName: any) {
    var uri = 'data:application/vnd.ms-excel;base64,',
      template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"  xmlns="http://www.w3.org/TR/REC-html40"><head> <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets> <x:ExcelWorksheet><x:Name>{worksheet}</x:Name> <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions> </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook> </xml><![endif]--></head><body><div style="text-align:center"><h1 >${this._langChange.mw1}</h1><span>${this.startDate}</span> - <span>${this.endDate}</span></div> <table>{table}</table>
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
