import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, forkJoin, of, merge } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { Recipes } from './_interfaces/recipes';
import { Sells } from './_interfaces/sells';
import { DatePipe } from '@angular/common';
import { KitchenService } from './kitchen.service';

export const LANG = 'lang';
@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private location_id;
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: this.KitchenService.token.getValue(),
    }),
  };
  constructor(private _http: HttpClient, public datepipe: DatePipe,private KitchenService:KitchenService) {
   
  }
  getLocation(): Observable<any> {
    return this._http
      .get(`${environment.baseUrl}/business-location`, this.headerOptions)
      .pipe(shareReplay(1));
  }
  getRecipes(location): Observable<any> {
    let recipe;
    (location == ' ') ? recipe = this.fetch(`${environment.baseUrl}/product?send_lot_detail=1&per_page=100`)
      : recipe = this.fetch(
        `${environment.baseUrl}/product?send_lot_detail=1&per_page=100&location_id=${location}`
      );
    return recipe;
  }
  getRecipeByScroll(perPage,page, category,subCategory, location, search,sku): Observable<any> {
    let cateogryvalue = (category == null) ? '' : category;
    return (location == ' ' || location == '*') ? this._http.get(`${environment.baseUrl}/product?send_lot_detail=1&per_page=${perPage}&page=${page}&name=${search}&sku=${sku}&category_id=${cateogryvalue}&sub_category_id=${subCategory}`, this.headerOptions) :
      this._http.get(`${environment.baseUrl}/product?send_lot_detail=1&per_page=${perPage}&page=${page}&location_id=${location}&category_id=${cateogryvalue}&sub_category_id=${subCategory}&name=${search}&sku=${sku}`, this.headerOptions)
  }
  // Get All Sell
  getAllSell(start, end, location): Observable<any> {
    if (location == ' ' || location == '*') {
      return this._http.get(`${environment.baseUrl}/sell?start_date=${start}&end_date=${end}&per_page=-1`, this.headerOptions)
    }

    else {
      return this._http.get(`${environment.baseUrl}/sell?start_date=${start}&end_date=${end}&per_page=-1&location_id=${location}`, this.headerOptions)
    }
  }
  protected naturalNumberArrayFactory(n: number, start = 1): number[] {
    return [...Array(n).keys()].map((x) => x + start);
  }
  private getPaged(n: number, url): string {
    return url + '&page=' + n;
  }
  fetch(url): Observable<any> {
    return this._http.get<any>(url, this.headerOptions).pipe(
      shareReplay(1),
      map((firstPage) => {
        // Amount of page to get ( -1 because got firstPage)

        let pageToDownload =
          Math.ceil(firstPage.meta.last_page / firstPage.meta.current_page) - 1;
        // Generate array ids and replace them with GET requests

        let observables = this.naturalNumberArrayFactory(
          pageToDownload,
          2
        ).map((id) =>
          this._http.get<any>(this.getPaged(id, url), this.headerOptions)
        );
        // Add the first page to avoid to repeat the request

        observables.unshift(of(firstPage));

        return forkJoin([...observables]);
      })
    );
  }


  //Cancle Order
  cancleOrder(body: any, id): Observable<any> {
    return this._http.patch<any>(
      `${environment.baseUrl}/sell/${id}`,
      body,
      this.headerOptions
    );
  }
  // Get All Users
  getUsers(): Observable<any> {
    return this._http
      .get(`${environment.baseUrl}/user`, this.headerOptions)
      .pipe(shareReplay(1));
  }
  getContact(): Observable<any> {
    return this._http
      .get(`${environment.baseUrl}/contactapi?per_page=-1`, this.headerOptions)
      .pipe(shareReplay(1));
  }
  getCategory(id: string = ''): Observable<any> {
    if (id == '') {
      return this._http
        .get(`${environment.baseUrl}/taxonomy?per_page=-1`, this.headerOptions)
        .pipe(shareReplay(1));
    }
    else {
      return this._http
        .get(`${environment.baseUrl}/taxonomy/${id}?per_page=-1`, this.headerOptions)
        .pipe(shareReplay(1));

    }

  }
  getTax(): Observable<any> {
    return this._http
      .get(`${environment.baseUrl}/tax?per_page=-1`, this.headerOptions)
      .pipe(shareReplay(1));
  }
  // Get All Table Numbers
  getTableNumber(): Observable<any> {
    this.location_id = localStorage.getItem('userLocation');
    let table;
    this.location_id == ' '
      ? (table = this._http
        .get(`${environment.baseUrl}/table?per_page=-1`, this.headerOptions)
        .pipe(shareReplay(1)))
      : (table = this._http
        .get(
          `${environment.baseUrl}/table?location_id=${this.location_id}`,
          this.headerOptions
        )
        .pipe(shareReplay(1)));

    return table;
  }
  sendCart(body: any): Observable<any> {
    return this._http.post<any>(
      `${environment.baseUrl}/sell`,
      body,
      this.headerOptions
    );
  }
}
