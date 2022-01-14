import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, from } from 'rxjs';
import { SharedService } from '../dataShared';
import { RecipeService } from '../recipe.service';
import { Recipes } from '../_interfaces/recipes';
@Injectable({
  providedIn: 'root',
})
export class RecipeResolverService implements Resolve<any> {
  resolve(): Observable<any> | Promise<any> | any {
    return  this._SharedService.currentallRecipes.subscribe((data) => {
      return data
    });
  }
  constructor(private _SharedService: SharedService) {}
}
