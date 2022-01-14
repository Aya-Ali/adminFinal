import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class KitchenService {
  baseUrl: string = "https://test.adf.house/api/tp-connector"
  public dataSellSocket: Subject<any> = new Subject<any>();
  public dataDeleteSellSocket: Subject<any> = new Subject<any>();
  public token: BehaviorSubject<any> = new BehaviorSubject(null);
  private pusherClient: Pusher;
  constructor(private _HttpClient: HttpClient) {
    if (localStorage.getItem("userToken") != null) {
      this.saveCurrentUser()
    }

  }

  saveUserLocation(dataLocation) {
    Pusher.logToConsole = false;
    // this.pusherClient = new Pusher('tbn9lfihbi', {
    //   wsHost: 'socket.tps-egy.com',
    //   httpHost: '0.0.0.0',
    //   statsHost: '0.0.0.0',
    //   forceTLS: false,
    //   disableStats: true,
    //   enabledTransports: ['ws', 'wss']
    // });
    // ----------test-----------
    this.pusherClient = new Pusher('3fo86dpfoi', {
      wsHost: 'socket.tps-egy.com',
      httpHost: '0.0.0.0',
      statsHost: '0.0.0.0',
      forceTLS: false,
      disableStats: true,
      enabledTransports: ['ws', 'wss']
    });
    dataLocation.forEach(element => {

      this.pusherClient.subscribe(`location-${element.id}`).bind(
        'TransactionCreated',
        (data: any) => {
          console.log("TransactionCreated",data);
          
          this.dataSellSocket.next(data);
        });
      this.pusherClient.subscribe(`location-${element.id}`).bind(
        'TransactionUpdated',
        (data: any) => {
          console.log("TransactionUpdated",data);
          this.dataSellSocket.next(data);
        });
      this.pusherClient.subscribe(`location-${element.id}`).bind(
        'TransactionDeleted',
        (data: any) => {
          this.dataDeleteSellSocket.next(data)
        });
    })
  }
  sellItemsFromSocket(): Observable<any> {
    return this.dataSellSocket.asObservable();
  }
  sellDeleteFromSocket(): Observable<any> {
    return this.dataDeleteSellSocket.asObservable();
  }
  saveCurrentUser() {
    let Token: any = localStorage.getItem("userToken")
    this.token.next(Token);

  }
  login(FormData: any): Observable<any> {
    let headerOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json'
      }),
    };
    return this._HttpClient.post<any>(
      `${this.baseUrl}/login`,
      FormData,
      headerOptions
    );
  }
  logOut(): Observable<any> {
    let headerOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        Authorization: this.token.getValue()
      })
    };
    return this._HttpClient.post<any>(
      `${this.baseUrl}/logout`, {},
      headerOptions
    );
  }
  reloadData(): Observable<any> {
    let headerOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        Authorization: this.token.getValue()
      })
    };
    return this._HttpClient.get<any>(
      `${this.baseUrl}/me`,
      headerOptions
    );
  }
  getSells(startData, endDate): Observable<any> {
    if (this.token.getValue() != null) {
      let headerOptions = {
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: this.token.getValue()
        })
      };
      return this._HttpClient.get<any>(
        `${this.baseUrl}/sell?start_date=${startData}&end_date=${endDate}`,
        headerOptions
      );
    }


  }
  // Change Sell status
  changeStatus(body: any): Observable<any> {
    let headerOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        Authorization: this.token.getValue()
      })
    };
    return this._HttpClient.post<any>(
      `${this.baseUrl}/update-shipping-status`,
      body,
      headerOptions
    );
  }
}
