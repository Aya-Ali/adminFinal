import { Component, OnInit } from '@angular/core';
import { SharedService } from '../dataShared';
import readXlsxFile from 'read-excel-file'
import { AuthService } from '../auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LangEn } from '../langEn';
import { Lang } from '../lang';
import { LangAr } from '../langAr';
import { filter } from 'rxjs/operators';
import { KitchenService } from '../kitchen.service';
@Component({
  selector: 'app-officer',
  templateUrl: './officer.component.html',
  styleUrls: ['./officer.component.css']
})
export class OfficerComponent implements OnInit {

  public OfficerData: any = [];
  public CopyOfficer: any = [];
  public department: any = [];
  public userData: any;
  public _langChange: any;
  public location_id;
  public roleNumber: string;
  constructor(public _KitchenService: KitchenService, private _authService: AuthService, private _dataShared: SharedService,
    private _router: Router) {
    this._router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects
        ) {
          this._router.navigate(['/admin']);
          localStorage.setItem("path", "officer")
        }
      })
    this._dataShared.changeCurrentLoading(false);
  }

  uploadData(input) {
    readXlsxFile(input.files[0]).then((data) => {
      this.OfficerData = this.convertToArrayOfObjects(data);
      this.CopyOfficer = this.OfficerData;
      if (this.OfficerData.length > 0) {
        this.OfficerData.forEach(element => {
          this.department.push(element.Mobile.substring(element.Mobile.indexOf("/")))
        });
      }
      this.department = this.department.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      })
    });
  }
  departmentOption(value) {

    if (value != '*') {
      this.OfficerData = this.CopyOfficer.filter((data) => {
        return data.Mobile.includes(value)
      })
    }
    else {
      this.OfficerData = this.CopyOfficer
    }
  }
  // 
  convertToArrayOfObjects(data) {
    var keys = data.shift(),
      i = 0, k = 0,
      obj = null,
      output = [];
    for (i = 0; i < data.length; i++) {
      obj = {};
      for (k = 0; k < keys.length; k++) {
        let x = (keys[k] != null) ? keys[k].replace(/\s/g, '') : keys[k];
        obj[x] = data[i][k];
      }

      output.push(obj);
    }

    return output;
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
    var divToPrint = document.getElementById("tableOfficer");
    let newWin = window.open("");
    newWin.document.write(`<div style="text-align:center"><h1>Officer</h1></div>` + divToPrint.outerHTML + `<p style="text-align:center;">© Copyright 2020
      <span >${environment.copyright1}</span>
      , Developed By
      ${environment.copyright2}
    </p>`);
    newWin.print();
    newWin.close();


  }
  exportThisWithParameter(tableID: any, excelName: any) {
    var uri = 'data:application/vnd.ms-excel;base64,',
      template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"  xmlns="http://www.w3.org/TR/REC-html40"><head> <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets> <x:ExcelWorksheet><x:Name>{worksheet}</x:Name> <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions> </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook> </xml><![endif]--></head><body><div style="text-align:center"><h1 >Officer</h1></div> <table>{table}</table>
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
