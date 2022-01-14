import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, from } from 'rxjs';
import { RecipeService } from '../recipe.service';
@Injectable({
  providedIn: 'root',
})
export class FinanceResolverService implements Resolve<any> {
  resolve(): Observable<any> | Promise<any> | any {
    // return this._RecipeService.getCashRegister();
  }
  constructor(private _RecipeService: RecipeService) {}
}
