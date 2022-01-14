import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeService } from '../recipe.service';

@Injectable({
  providedIn: 'root'
})
export class CashResolverService {
  resolve(): Observable<any> | Promise<any> | any {
    return this._RecipeService.getUsers()
  }
  constructor(private _RecipeService: RecipeService) { }
}
