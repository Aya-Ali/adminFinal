import { Component, OnInit } from '@angular/core';
import {
  RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  Router,
} from '@angular/router';
import { environment } from 'src/environments/environment';
import { SharedService } from './dataShared'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loading = true;
  routerEvent: Event;
  isfullscreen: boolean;
  currentRoute: any;
  copyRight1;
  copyRightUrl;
  copyRight2
  constructor(
    private router: Router,
    private _SharedService: SharedService
  ) {
    this.copyRight1 = environment.copyright1;
    this.copyRightUrl = environment.copyrightUrl;
    this.copyRight2 = environment.copyright2;
    this.router.events.subscribe((routerEvent: RouterEvent) => {
      this.checkRouterEvent(routerEvent);
    });

  }
  ngOnInit() {
    window.ontouchstart = () => this.openFullscreen();
  }

  openFullscreen() {
    const element = document.documentElement as HTMLElement & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };
    if(document.fullscreenElement)
    {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        /* Firefox */
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        /* IE/Edge */
        element.msRequestFullscreen();
      }
    }
    else{
      element.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    }
   
  }

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
      if (routerEvent.id == 1 && routerEvent.url == '/') {
        localStorage.removeItem('lang');
      } else {
        this.openFullscreen();
      }
    }

    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this._SharedService.currentloading.subscribe((data) => {
        this.loading =data
      });
    }
  }
}
