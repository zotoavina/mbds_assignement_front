import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnimationOptions } from 'ngx-lottie/lib/symbols';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  loginForm: FormGroup;

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
      (response) => {
        console.log(response);
        if(response.code == 202){
          this.router.navigate(['/home']); 
        }
      },(error) => {
        console.log(error);
      }
    );
  }

}
