import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  login!:string
  password!:string

  constructor(private authService: AuthService){}

  onSubmit(event:any){
    console.log(event);
    if(this.login == "") return
    if(this.password == "") return
    this.authService.logIn(this.login, this.password)
  }

}
