import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../dataShared';
import { KitchenService } from '../kitchen.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  public users: any;
  public noUser: boolean = false;
  public allRecipe: any = [];
  public location: any;
  public Locations: any;
  public clicked: boolean = false;
  userForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/),
    ]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    private router: Router,
    private _dataShared: SharedService,
    private KitchenService: KitchenService,
  ) {
    this._dataShared.changeCurrentLoading(false)
    if (localStorage.getItem("user") != null && localStorage.getItem("path") != null) {
      this.router.navigate([localStorage.getItem("path")]);
      this.reloadData()
    }
  }

  reloadData() {
    this.KitchenService.reloadData().subscribe((data) => {
      this._dataShared.changeCurrentUsers(data);
      this.KitchenService.saveUserLocation(data.locations)
    }, (error) => {
      console.log(error);

      this._dataShared.changeRoles(null);
      localStorage.clear()
      this.router.navigate(['/admin']);
    })


  }
  ngOnInit(): void { }
  userData() {
    if (this.userForm.valid) {
      this.KitchenService.login(this.userForm.value).subscribe((data) => {
        this.users = data.user
        this.noUser = false;
        this._dataShared.changeCurrentUsers(this.users);
        localStorage.setItem('user', JSON.stringify(this.users.id));
        localStorage.setItem('locationss', JSON.stringify(this.users.locations));
        localStorage.setItem('userRo', this.users.role);
        localStorage.setItem("userToken", data.token_type + " " + data.access_token);
        this.KitchenService.saveCurrentUser()
        this.KitchenService.saveUserLocation(this.users.locations)
        if (this.users.locations.length > 0) {
          localStorage.setItem('userLocation', ' ')
        }
        if (this.users.role == '7') {
          this.router.navigate(['/finance']);
        }
        else if (this.users.role == '8') {
          this.router.navigate(['/parties']);
        }
        else if (this.users.role == '9') {
          this.router.navigate(['/product']);
        }
        else if (this.users.role == '15') {
          this.router.navigate(['/pos']);
        }
        else {
          this.router.navigate(['/kitchen']);
        }
      }, (error) => {
        console.log(error);
        this.noUser = true;
      })
    }
  }


}
