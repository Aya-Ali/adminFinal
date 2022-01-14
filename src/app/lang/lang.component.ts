import { Component, OnInit ,AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { SharedService } from '../dataShared';
import { Lang } from '../lang';
import { LangAr } from '../langAr';
import { LangEn } from '../langEn';
declare var $: any;
@Component({
  selector: 'app-lang',
  templateUrl: './lang.component.html',
  styleUrls: ['./lang.component.css']
})

export class LangComponent implements OnInit,AfterViewInit {
  userLanguage:string;
  lang: string="en";
  loading: boolean;
  constructor(private _authService:AuthService,private data: SharedService) { }

  ngOnInit(): void {
    if(this._authService.getUserLanguage() == null)
    {
      this._authService.setUserLanguage("en")
    }
    this.lang = this._authService.getUserLanguage();
     // this.changeLanguage(this._authService.getUserLanguage())
  }
  ngAfterViewInit(): void {
  }

  changeLanguage(event:any) {
    this.data.changeLang(true);
    // debugger;
    // this.data.langVar.subscribe(
    //   (message) => (this.lang = message)
    // );
    Lang.changeLoad();

    if (this._authService.getUserLanguage() === 'en' && event == "en") {
      this.loading = true;
      // this.translate.use('ar');
      Lang.changeDirection('rtl');
      this.data.changeLang(LangAr)
      this.data.changeLang2('ar')
      this._authService.setUserLanguage('ar');
      $("#chck").attr("lang","ar");
      // this.data.changeLang('ar');
      
      $("#checkTrail").removeClass("ar").addClass("en");
      $("#lang").removeClass("ar").addClass("en");
      $(".aside-item i").removeClass("fa-arrow-left").addClass("fa-arrow-right");
    } else {
      this.data.changeLang(LangEn)
      // this.translate.use('en');
      Lang.changeDirection('ltr');
      this._authService.setUserLanguage('en');
     $("#chck").attr("lang","en");
     this.data.changeLang2('en')
      // this.data.changeLang('en');
       $("#checkTrail").removeClass("en").addClass("ar");
      
       $("#lang").removeClass("en").addClass("ar");
      $(".aside-item i").removeClass("fa-arrow-right").addClass("fa-arrow-left");

    }

  }

}
