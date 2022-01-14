import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeResolverService } from './resolvers/recipe-resolver.service';
import { SinglerecipeResolverService } from './resolvers/singlerecipe-resolver.service';
import { FinanceResolverService } from './resolvers/finance-resolver.service';
import { CashResolverService } from './resolvers/cash-resolver.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdminComponent } from './admin/admin.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { AuthGuard } from './auth.guard';
import { FinanceGuard } from './finance.guard';
import { KitchenGuard } from './kitchen.guard';
import { PartiesGuard } from './parties.guard';
import { SellsGuard } from './sells.guard';
import { PosGuard } from './pos.guard';
import { ProductGuard } from './product.guard';
import { FinanceComponent } from './finance/finance.component';
import { PartiesComponent } from './parties/parties.component';
import { FbControlComponent } from './fb-control/fb-control.component';
import { FbproductComponent } from './fbproduct/fbproduct.component';
import { PosComponent } from './pos/pos.component';
import { MW1Component } from './mw1/mw1.component';
import { Mw4Component } from './mw4/mw4.component';
import { Mw2Component } from './mw2/mw2.component';
import { Mw3Component } from './mw3/mw3.component';
import { Mw5Component } from './mw5/mw5.component';
import { OfficerComponent } from './officer/officer.component';
const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  {
    path: 'admin', component: AdminComponent
    // , resolve: {
    //   recipe: RecipeResolverService,
    //   // sell: SinglerecipeResolverService,
    // },
  },
  {
    path: 'kitchen',
    component: KitchenComponent,
    // resolve: {
    //   recipe: RecipeResolverService,
    //   // sell: SinglerecipeResolverService,
    // },
    canActivate: [KitchenGuard],
  },
  // {
  //   path: "finance",
  //   component: FinanceComponent,
  //   resolve: {
  //     recipe: RecipeResolverService,
  //     // sell: SinglerecipeResolverService,
  //   },
  //   canActivate: [FinanceGuard],
  // },
  // {
  //   path: "parties",
  //   component: PartiesComponent,
  //   resolve: {
  //     recipe: RecipeResolverService,
  //     // sell: SinglerecipeResolverService,
  //   },
  //   canActivate: [PartiesGuard],
  // },
  // {
  //   path: "sells",
  //   component: FbControlComponent, resolve: {
  //     recipe: RecipeResolverService,
  //     // sell: SinglerecipeResolverService,
  //   },
  //   canActivate: [SellsGuard],
  // },
  // {
  //   path: "product",
  //   component: FbproductComponent, resolve: {
  //     recipe: RecipeResolverService,
  //     // sell: SinglerecipeResolverService,
  //   },
  //   canActivate: [ProductGuard],
  // },
  // {
  //   path: "pos",
  //   component: PosComponent, resolve: {
  //     recipe: RecipeResolverService,
  //   },
  //   canActivate: [PosGuard],
  // },
  // {
  //   path: "gw1",
  //   component: MW1Component,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: "gw2",
  //   component: Mw2Component,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: "gw3",
  //   component: Mw3Component,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: "gw4",
  //   component: Mw4Component,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: "gw5",
  //   component: Mw5Component,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: "officer",
  //   component: OfficerComponent,
  // },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
