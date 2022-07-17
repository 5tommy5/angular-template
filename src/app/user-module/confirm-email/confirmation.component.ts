import { Component, Input, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared-module/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { ResendConfirmationCodeModel } from 'src/app/shared-module/models/user/resendConfirmationCode.model';



@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  email: string;

  public loading : boolean = false;

  public text : string = "Please, verify your email. We send you a link.";

  private code : string = "";
  constructor(private _service : AuthenticationService, private router: Router, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => this.email = params['email']);
    this.route.queryParams
      .subscribe(params => {
          this.code = params['token'];

          console.log(params);
          if(this.code != null){
            this.confirm();
          }
        }
    );
  }
  confirm(){


    let time = setTimeout(x=> {
      this.loading = true;
    }, 400);


    this._service.confirmEmail(this.code).subscribe((x)=>{
      clearTimeout(time);
      this.loading = false;
      console.log(x);
      if(!x.success){
        console.log("hmm, what are you doin?");
      }
      else{
        this.text = "Your email is verified! You will be redirected to login page.";
        setTimeout(()=>{
          this.router.navigateByUrl('login');
        }, 2000);
      }

    }, error => {
      clearTimeout(time);
      this.loading = false;
      console.log("hmm, what are you doin?");
    })
  }

  resend(){
    let conf = new ResendConfirmationCodeModel();
    conf.email = this.email;

    console.log(this.email);

    this._service.resendConfirmationEmail(conf).subscribe((res)=>{
        this.loading = false;
        this.text = "We sended confirmation email again"
      }, 
      (error)=>{
        this.loading = false;
        this.text = "Could not send email again";
      }
    )
  }
}
