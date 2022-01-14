import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedService } from './dataShared';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule} from '@angular/common/http';
import { LangComponent } from './lang/lang.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ReactiveFormsModule ,FormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { DatePipe } from '@angular/common';
import { FilterRecipePipe } from './pipe/filter-recipe.pipe';
import { FinanceComponent } from './finance/finance.component';
import { FilterCashPipe } from './pipe/filter-cash.pipe';
import { ReplacePipe } from './pipe/replace.pipe';
import { VariationNamePipe } from './pipe/variation-name.pipe';
import { TableNamePipe } from './pipe/table-name.pipe';
import { TimePipe } from './pipe/time.pipe';
import { RightpartPipe } from './pipe/rightpart.pipe';
import { SumPipe } from './pipe/sum.pipe';
import { TotalamountPipe } from './pipe/totalamount.pipe';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { TimeKitchenPipe } from './pipe/time-kitchen.pipe';
import { PartiesComponent } from './parties/parties.component';
import { PartiesPipe } from './parties.pipe';
import { FbControlComponent } from './fb-control/fb-control.component';
import { SumFbPipe } from './sum-fb.pipe';
import { FbproductComponent } from './fbproduct/fbproduct.component';
import { PosComponent } from './pos/pos.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MW1Component } from './mw1/mw1.component';
import { Mw4Component } from './mw4/mw4.component';
import { Mw2Component } from './mw2/mw2.component';
import { Mw3Component } from './mw3/mw3.component';
import { Mw5Component } from './mw5/mw5.component';
import { OfficerComponent } from './officer/officer.component';
import { OfficerPipe } from './officer.pipe';


@NgModule({
  declarations: [
    AppComponent,
    LangComponent,
    NotFoundComponent,
    AdminComponent,
    KitchenComponent,
      PartiesComponent,
    FbControlComponent,
    FbproductComponent,
    PosComponent,
    MW1Component,
    Mw4Component,
    Mw2Component,
    Mw3Component,
    Mw5Component,
    OfficerComponent,
    FilterRecipePipe,
    FinanceComponent,
    FilterCashPipe,
    ReplacePipe,
    VariationNamePipe,
    TableNamePipe,
    TimePipe,
    RightpartPipe,
    SumPipe,
    TotalamountPipe,
    TimeKitchenPipe,
    PartiesPipe,
    SumFbPipe,
    OfficerPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxDaterangepickerMd.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
  ],
  providers : [SharedService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
