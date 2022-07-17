import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared-module/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private _service: AuthenticationService){}

  refreshTimer: any;

  ngOnInit(): void {
    setInterval(()=>{
      if(sessionStorage.getItem("refreshToken") !== undefined && sessionStorage.getItem("refreshToken") !== null){
        this._service.refreshToken();
      }
    }, 240000);
  }
  title = 'angular-template';


}
