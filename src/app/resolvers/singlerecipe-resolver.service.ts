import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Resolve} from '@angular/router';
import { Observable } from 'rxjs';
import { RecipeService } from '../recipe.service';
import { Sells } from '../_interfaces/sells';
@Injectable({
  providedIn: 'root'
})
export class SinglerecipeResolverService implements Resolve<Sells[]> {
  resolve(): 
  Observable<Sells[]> | Promise<Sells[]>|Sells[] {
    // let date = new Date();
    // let date1 = date.toLocaleString('en', { timeZone: 'Africa/Cairo' });
    // let latest_date = this.datepipe.transform(date1, 'yyyy-MM-dd');
    // let location = localStorage.getItem('userLocation')
    // return this._RecipeService.getAllSell(latest_date,latest_date,location);
    return ;
  }
  constructor(private _RecipeService:RecipeService,public datepipe: DatePipe) { }
}
