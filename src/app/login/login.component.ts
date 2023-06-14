import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnimationOptions } from 'ngx-lottie/lib/symbols';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { Reponse } from '../shared/reponse.model';
import { TOKEN_STORAGE } from '../shared/constants';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  loginForm: FormGroup;
  message?: String;

  options: AnimationOptions = {
    path: '/assets/login_lottie_animation.json',
  };

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ){
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      mdp: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }
    const email = this.loginForm.controls['email'].value;
    const motDePasse = this.loginForm.controls['mdp'].value;
    console.log("email:"+ email);
    console.log("motDePasse:"+ motDePasse);

    this.authService.logIn(email, motDePasse).subscribe(
      (response: Reponse) => {
        console.log(response);
        if(response.code == 202){
          localStorage.setItem(TOKEN_STORAGE, response.data.token);
          this.router.navigate(['/home']); 
        }else{
            this.message = response.message;
        }
      }
    );
  }

}
