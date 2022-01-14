import { Injectable } from '@angular/core';
import { Subject, from, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable()
export class SharedService {

  private currentCategoryID = new BehaviorSubject<number>(environment.categoryId);
  currentMessage = this.currentCategoryID.asObservable();

  private cartCounter = new Subject<number>();
  currentCounter = this.cartCounter.asObservable();

  private totalFood = new Subject<any>();
  CurrenttotalFood = this.totalFood.asObservable();

  private currentId= new Subject<any>();
  currentIdCounter = this.currentId.asObservable();

  private allRecipes= new Subject<any>();
  currentallRecipes = this.allRecipes.asObservable();

  private allUsers= new BehaviorSubject<any>(null);
  currentallUsers = this.allUsers.asObservable();

  private allLocation= new Subject<any>();
  currentallLocation = this.allLocation.asObservable();
  private loading= new BehaviorSubject<any>(false);
  currentloading = this.loading.asObservable();

  private quantity= new Subject<any>();
  quantityObj = this.quantity.asObservable();
  private lang= new Subject<any>();
  langVar = this.lang.asObservable();
  private lang2= new BehaviorSubject<string>('');
  langVar2 = this.lang2.asObservable();

  private tableNumber = new Subject<any>();
  currenttableNumber = this.tableNumber.asObservable();
  
  private Roles = new Subject<any>();
  currentRoleNumber = this.Roles.asObservable();
  constructor() { }

  changeCurrentCategoryID(message: number) {
    this.currentCategoryID.next(message)
  }

  changeCurrentCartID(message: number , id:any)
  {
    this.cartCounter.next(message);
    this.currentId.next(id) 
  }
  changeCurrentRecipes(recipes:any)
  {
    this.allRecipes.next(recipes) 
  }
  changeCurrentUsers(users:any)
  {
    this.allUsers.next(users) 
  }
  changeCurrentLocation(location:any)
  {
    this.allLocation.next(location) 
  }
  changeCurrentLoading(loading:any)
  {
    this.loading.next(loading) 
  }
  changeCurrentTotalFood(total:any)
  {

    this.totalFood.next(total);
    
  }
  changeQuantity(quantity:any)
  {
    this.quantity.next(quantity)
  }
  changeLang(lang:any)
  {
    this.lang.next(lang);
  }
  changeLang2(lang2:string)
  {
    this.lang2.next(lang2);
  }

  changeTableNumber(locationNum,tablenum:string)
  {
    this.tableNumber.next([locationNum,tablenum])
  }

  changeRoles(Role:any)
  {
    this.Roles.next(Role)
  }
}