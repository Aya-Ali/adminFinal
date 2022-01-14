import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { SharedService } from '../dataShared';
import { Lang } from '../lang';
import { LangAr } from '../langAr';
import { LangEn } from '../langEn';
import { RecipeService } from '../recipe.service';
import * as moment from 'moment';
import { filter } from 'rxjs/operators';
import { KitchenService } from '../kitchen.service';

declare let $: any;
@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css'],
})
export class FinanceComponent implements OnInit {

  public sells: any = [];
  public groupA: any = [];
  public groupB: any = [];
  public groupC: any = [];
  public groupD: any = [];
  public groupE: any = [];
  public groupF: any = [];
  public groupG: any = [];
  public groupH: any = [];
  public groupI: any = [];
  public category: any = [];
  public cashGroupA: number = 0;
  public visaGroupA: number = 0;
  public roomGroupA: number = 0;
  public dueGroupA: number = 0;
  public finalTotalGroupA: number = 0;
  public cashGroupB: number = 0;
  public visaGroupB: number = 0;
  public dueGroupB: number = 0;
  public finalTotalGroupB: number = 0;
  public cashGroupC: number = 0;
  public visaGroupC: number = 0;
  public dueGroupC: number = 0;
  public finalTotalGroupC: number = 0;
  public cashGroupF: number = 0;
  public visaGroupF: number = 0;
  public dueGroupF: number = 0;
  public finalTotalGroupF: number = 0;
  public hospitalityGroupD: number = 0;
  public generalHospitalityGroupD: number = 0;
  public partiesHospitalityGroupD: number = 0;
  public hotelHospitalityGroupD: number = 0;
  public cashGroupG: number = 0;
  public visaGroupG: number = 0;
  public dueGroupG: number = 0;
  public finalTotalGroupG: number = 0;
  public outComeGroupH: number = 0;
  public paidGroupH: number = 0;
  public dueGroupH: number = 0;
  public finalTotalGroupH: number = 0;
  public outComeGroupI: number = 0;
  public paidGroupI: number = 0;
  public dueGroupI: number = 0;
  public finalTotalGroupI: number = 0;
  public allRecipe: any = [];
  public userData: any;
  public Locations;
  public location: any = ' ';
  public _langChange: any;
  public invoiceDetail: any;
  public startDate: any;
  public endDate: any;
  public roleNumber: string;
  public location_id;
  public selected: any;
  public location_name: any;
  public alwaysShowCalendars: boolean;
  public showRangeLabelOnInput: boolean;
  public keepCalendarOpeningWithRange: boolean;
  public loading2: boolean = true;
  public groupName: string;
  public sellsData = new BehaviorSubject<any>([]);
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
  constructor(private _RecipeService: RecipeService, private _authService: AuthService, private _DatePipe: DatePipe, private _dataShared: SharedService, public _KitchenService: KitchenService,
    private _router: Router) {
    this._dataShared.changeCurrentLoading(true)
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
          localStorage.setItem("path", "finance")
          this._router.navigate(['/admin']);

        }
      })
    // this.alwaysShowCalendars = true;
    // this.keepCalendarOpeningWithRange = true;
    // this.showRangeLabelOnInput = true;

    let date = new Date();
    let date1 = date.toLocaleString('en', { timeZone: 'Africa/Cairo' });
    this.startDate = this._DatePipe.transform(date1, 'yyyy-MM-dd');
    this.endDate = this.startDate;
    this.location = localStorage.getItem('userLocation')
  }
  getSells(start, end) {
    this.loading2 = true;
    this._RecipeService.getAllSell(start, end, ' ').subscribe((data) => {
      this.sellsData.next(data.data)

    }, () => { }, () => {
      this.getAllSell(start, end, ' ')
      this.loading2 = false
    })
  }
  getAllSell(start, end, mylocation = ' ') {

    this.sellsData.subscribe((data) => {

      // data.subscribe((data2) => {
      // this.sells = data2;
      this.sells = data;
      let dataArray2 = [];
      dataArray2 = this.sells;

      // for (let i = 0; i < this.sells.length; i++) {
      //   dataArray2.push(...this.sells[i].data);
      // }
      // let location;
      // location = mylocation

      // let dataArray = dataArray2.filter(
      //   (obj) => !(obj.contact_id == "1" && obj.payment_status == "due") && (location != '*' ? obj.location_id == location : true)
      // )
      let dataArray = dataArray2.filter(
        (obj) => obj.status == "final" && !(mylocation == ' ' || mylocation == '*') ? obj.location_id == mylocation : true
      )
      // Start Filter All Sells To Groups
      this.groupA = dataArray.filter((item) => (item.customer_group_id == environment.groupA || item.customer_group_id == null) && !item.invoice_no.startsWith("FB") && (item.location_id != environment.locationParty && item.location_id != environment.FoodBeverageMainWareHouseLocationID && item.location_id != environment.GeneralWareHouseLocationID))

      this.groupB = dataArray.filter((item) => item.customer_group_id == environment.groupB)

      this.groupC = dataArray.filter((item) => item.customer_group_id == environment.groupC)

      this.groupD = dataArray.filter((item) => (item.customer_group_id == environment.groupD1 || item.customer_group_id == environment.groupD2 || item.customer_group_id == environment.groupD3 || item.customer_group_id == environment.groupD4))

      this.groupE = dataArray.filter((item) => item.customer_group_id == environment.groupE)

      this.groupF = dataArray.filter((item) => item.invoice_no.startsWith("FB"))


      this.groupG = dataArray.filter((item) => item.location_id == environment.locationParty);

      this.groupH = dataArray.filter((item) => item.location_id == environment.FoodBeverageMainWareHouseLocationID)

      this.groupI = dataArray.filter((item) => item.location_id == environment.GeneralWareHouseLocationID)

      // End Filter All Sells To Groups

      // Start Calculate left Part Of table  
      this.cashGroupA = 0, this.visaGroupA = 0, this.roomGroupA = 0, this.dueGroupA = 0, this.cashGroupB = 0, this.cashGroupC = 0, this.cashGroupF = 0, this.cashGroupG = 0, this.outComeGroupH = 0, this.outComeGroupI = 0, this.visaGroupB = 0, this.visaGroupC = 0, this.visaGroupF = 0, this.visaGroupG = 0, this.paidGroupH = 0, this.paidGroupI = 0,
        this.dueGroupB = 0, this.dueGroupC = 0, this.dueGroupF = 0, this.dueGroupG = 0, this.dueGroupH = 0, this.dueGroupI = 0, this.finalTotalGroupA = 0, this.finalTotalGroupB = 0, this.finalTotalGroupC = 0, this.finalTotalGroupF = 0, this.finalTotalGroupG = 0, this.finalTotalGroupH = 0, this.finalTotalGroupI = 0;

      this.groupA.forEach(element => {
        // Start GroupA hotalRoom       
        if (element.customer_group_id == environment.groupA) {
          this.roomGroupA += Number(element.final_total)
        }
        // End GroupA hotalRoom
        else if (element.customer_group_id == null) {
          // Start GroupA Cash
          if ((element.payment_lines[0] && element.payment_lines[0].method == 'cash')) {
            this.cashGroupA += Number(element.final_total)
          }
          // End GroupA Cash
          // Start GroupA Visa
          else if (element.payment_lines[0] && element.payment_lines[0].method == 'card') {
            this.visaGroupA += Number(element.final_total)
          }
          // End GroupA Visa    
          // Start GroupA Due
          if ((element.customer_group_id != environment.groupA && element.payment_status == "due")) {
            this.dueGroupA += Number(element.final_total)
          }
          // End GroupA Due
        }

      });

      this.groupB.forEach(element => {

        if ((element.payment_status == "partial") || (element.payment_status == "paid")) {
          this.finalTotalGroupB = 0;
          element.payment_lines.forEach(element2 => {
            if (element2.is_return == 0) {
              if (element2.method == "cash") {
                this.cashGroupB += Number(element2.amount)
              }

              else if (element2.method == "card") {
                this.visaGroupB += Number(element2.amount)
              }

              this.finalTotalGroupB += Number(element2.amount);
            }
            else {

              if (element2.method == "cash") {
                this.cashGroupB -= Number(element2.amount)
              }

              else if (element2.method == "card") {
                this.visaGroupB -= Number(element2.amount)
              }

              this.finalTotalGroupB -= Number(element2.amount);
            }

          });
          this.dueGroupB += (Number(element.final_total) - Number(this.finalTotalGroupB))
        }
        else if (element.payment_status == "due") {
          this.dueGroupB += Number(element.final_total)
        }

      });

      this.groupC.forEach(element => {

        if ((element.payment_status == "partial") || (element.payment_status == "paid")) {
          this.finalTotalGroupC = 0;
          element.payment_lines.forEach(element2 => {

            if (element2.method == "cash") {
              this.cashGroupC += Number(element2.amount)
            }
            else if (element2.method == "card") {
              this.visaGroupC += Number(element2.amount)
            }
            this.finalTotalGroupC += Number(element2.amount);
          });

          this.dueGroupC += (Number(element.final_total) - Number(this.finalTotalGroupC))
        }
        else if (element.payment_status == "due") {
          this.dueGroupC += Number(element.final_total)
        }


      });

      this.groupF.forEach(element => {
        this.finalTotalGroupF = 0;
        if ((element.payment_status == "partial") || (element.payment_status == "paid")) {
          element.payment_lines.forEach(element2 => {

            if (element2.method == "cash") {
              this.cashGroupF += Number(element2.amount)
            }
            else if (element2.method == "card") {
              this.visaGroupF += Number(element2.amount)
            }

            this.finalTotalGroupF += Number(element2.amount);

            // }

          });
          this.dueGroupF += (Number(element.final_total) - Number(this.finalTotalGroupF))
        }
        else if (element.payment_status == "due") {
          this.dueGroupF += Number(element.final_total)
        }
        // }

      });

      this.groupG.forEach(element => {
        this.finalTotalGroupG = 0;
        if ((element.payment_status == "partial") || (element.payment_status == "paid")) {
          element.payment_lines.forEach(element2 => {
            if (element2.method == "cash" || element2.method == "custom_pay_1") {
              this.cashGroupG += Number(element2.amount)
            }
            else if (element2.method == "card") {
              this.visaGroupG += Number(element2.amount)
            }
            this.finalTotalGroupG += Number(element2.amount);
          });
          this.dueGroupG += (Number(element.final_total) - Number(this.finalTotalGroupG))
        }
        else if (element.payment_status == "due") {
          this.dueGroupG += Number(element.final_total)
        }

      });

      this.groupH.forEach(element => {
        this.finalTotalGroupH = 0;
        if (element.customer_group_id == environment.groupH_I) {
          if ((element.payment_status == "partial") || (element.payment_status == "paid")) {
            element.payment_lines.forEach(element2 => {
              if (element2.method == "cash" || element2.method == "card") {
                this.paidGroupH += Number(element2.amount)
              }
              this.finalTotalGroupH += Number(element2.amount);
            });
            this.dueGroupH += (Number(element.final_total) - Number(this.finalTotalGroupH))
          }
          else if (element.payment_status == "due") {
            this.dueGroupH += Number(element.final_total)
          }
        }
        else {
          this.outComeGroupH += Number(element.final_total)
        }
      });

      this.groupI.forEach(element => {
        this.finalTotalGroupH = 0;
        if (element.customer_group_id == environment.groupH_I) {
          if ((element.payment_status == "partial") || (element.payment_status == "paid")) {
            element.payment_lines.forEach(element2 => {
              if (element2.method == "cash" || element2.method == "card") {
                this.paidGroupI += Number(element2.amount)
              }
              this.finalTotalGroupI += Number(element2.amount);
            });
            this.dueGroupI += (Number(element.final_total) - Number(this.finalTotalGroupI))
          }
          else if (element.payment_status == "due") {
            this.dueGroupI += Number(element.final_total)
          }
        }
        else {
          this.outComeGroupI += Number(element.final_total)
        }
      });



      this.hospitalityGroupD = 0, this.generalHospitalityGroupD = 0, this.partiesHospitalityGroupD = 0, this.hotelHospitalityGroupD = 0;
      this.groupD.forEach(element => {
        // hospitalityGroupD
        if (element.customer_group_id == environment.groupD1) {
          this.hospitalityGroupD += Number(element.final_total)
        }
        // generalHospitalityGroupD
        else if (element.customer_group_id == environment.groupD2) {
          this.generalHospitalityGroupD += Number(element.final_total)
        }
        // partiesHospitalityGroupD
        else if (element.customer_group_id == environment.groupD3) {
          this.partiesHospitalityGroupD += Number(element.final_total)
        }
        // hotelHospitalityGroupD
        else if (element.customer_group_id == environment.groupD4) {
          this.hotelHospitalityGroupD += Number(element.final_total)
        }
      });
    })

  }

  getCategory() {
    this._RecipeService.getCategory().subscribe((data) => {
      this.category = data

    })
  }
  getAllRecipe(location) {
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
  printData() {
    var divToPrint = document.getElementById("tableFinance");
    let newWin = window.open("");
    newWin.document.write(`<div style="text-align:center"><h1 >Finance Report</h1><h2 >${(this.location_name) ? this.location_name : ""}</h2><span>${this.startDate}</span> - <span>${this.endDate}</span></div>` + divToPrint.outerHTML + `<p style="text-align:center;">© Copyright 2020
    <span >${environment.copyright1}</span>
    , Developed By
    ${environment.copyright2}
  </p>`);
    newWin.print();
    newWin.close();
  }
  exportThisWithParameter(tableID: any, excelName: any) {
    var uri = 'data:application/vnd.ms-excel;base64,',
      template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"  xmlns="http://www.w3.org/TR/REC-html40"><head> <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets> <x:ExcelWorksheet><x:Name>{worksheet}</x:Name> <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions> </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook> </xml><![endif]--></head><body><div style="text-align:center"><h1 >Finance Report</h1><h2 >${(this.location_name) ? this.location_name : ""}</h2><span>${this.startDate}</span> - <span>${this.endDate}</span></div> <table>{table}</table>
      <p style="text-align:center;">© Copyright 2020
              <span >${environment.copyright1}</span>
              , Developed By
              ${environment.copyright2}
            </p>
      </body></html>`,
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
  invoiceDetails(group, groupName) {
    this.invoiceDetail = group;
    this.groupName = groupName;
  }
  // Refresh Button To Get New Sell Data
  refreshSell(event) {
    // $(event.target).children().toggleClass('down');
    $("#refreshBtn").toggleClass('down');
    this.getSells(this.startDate, this.endDate);
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
  getLocations() {
    this._dataShared.currentallLocation.subscribe((data) => {
      this.Locations = data;
    });
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
          this.getAllRecipe(this.location_id)
        }
      }
    });
  }
  //get Select Option
  selectTime(time) {

    this.startDate = this._DatePipe.transform(time.startDate._d, 'yyyy-MM-dd');
    this.endDate = this._DatePipe.transform(time.endDate._d, 'yyyy-MM-dd');
    this.getSells(this.startDate, this.endDate);
    // this.today = time;
  }
  //get Select Option
  selectOption(location) {
    // this.selectedOption.next(location);
    this.location = location;
    this.location_name = this.Locations.filter((obj) => obj.id == location)[0]?.name
    this.getAllSell(this.startDate, this.endDate, this.location);
  }
  ngOnInit(): void {

    this.getCategory();
    // this.getAllSell(this.startDate, this.endDate, this.location);
    this.getLocations();
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

}

