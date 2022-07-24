import { Component, Input, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared-module/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { ResendConfirmationCodeModel } from 'src/app/shared-module/models/user/resendConfirmationCode.model';



@Component({
  selector: 'forks',
  templateUrl: './forks.component.html',
  styleUrls: ['./forks.component.scss']
})
export class ForksComponent implements OnInit {

  public loading: boolean;
  constructor(private _service : AuthenticationService, private router: Router, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
  }

}
