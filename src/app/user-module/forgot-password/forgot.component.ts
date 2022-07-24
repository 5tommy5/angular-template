import { Component, Input, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared-module/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { ForgetPasswordModel } from 'src/app/shared-module/models/user/forgetPassword.model';
import { RecoverPasswordModel } from 'src/app/shared-module/models/user/recoverPassword.model';



@Component({
  selector: 'forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  model : ForgetPasswordModel = new ForgetPasswordModel();

  pass : string;
  public loading : boolean = false;

  public text : string = "";


  public code : string = null;
  constructor(private _service : AuthenticationService, private router: Router, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
          this.code = params['token'];

          console.log(params);
          if(this.code != null){
            this.recover();
          }
        }
    );
  }
  confirm(){
    let time = setTimeout(x=> {
      this.loading = true;
    }, 400);



    this._service.forgotPassword(this.model).subscribe((x)=>{
      clearTimeout(time);
      this.loading = false;
      console.log(x);
      this.text = "We send you a link to recover password.";
    }, error => {
      clearTimeout(time);
      this.loading = false;
      console.log("hmm, what are you doin?");
    })
  }

  recover(){
    let time = setTimeout(x=> {
      this.loading = true;
    }, 400);


    let rec = new RecoverPasswordModel();
    rec.recoveryToken = this.code;
    rec.password = this.pass;

    this._service.resetPassword(rec).subscribe((x)=>{
      clearTimeout(time);
      this.loading = false;
      console.log(x);
      if(x.success){
        this.router.navigateByUrl("login");
      }
      else{
        this.handleEr(x.errors[0]);
      }
    }, error => {
      clearTimeout(time);
      this.loading = false;
      console.log("hmm, what are you doin?");
    })
  }


  handleEr(errors : string){
    this.text = errors;
  }
}
