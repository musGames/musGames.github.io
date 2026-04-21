import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../Services/firebase.service';
import { NgIf } from '@angular/common';
import { getAuth, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

@Component({
  selector: 'app-login',
  imports: [NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  //form fields
  email: string='';
  password: string = '';
  errorMessage: string= '';

  constructor(
    private router: Router,
    private firebaseService: FirebaseService

  ){}

  //runs when component loads
  ngOnInit(): void {
    console.log('LoginComponent indlæst');
  }

  //update email and password when typing
  sendEmail(event: any): void {this.email= event.target.value; }
  sendPassword(event: any): void {this.password= event.target.value; }

  //login with Firebase
  login(event?: Event): void {
    event?.preventDefault();

    if(!this.email || !this.password){
      alert('Email and password cannot be empty');
      return;
    }

    const auth= getAuth();

    signInWithEmailAndPassword(auth,this.email, this.password)
    .then((cred: UserCredential) => this.afterSuccess(cred))
    .catch(err => this.afterError(err)); //error
  }

  //what happens on success
  private afterSuccess(cred: UserCredential):void {
    console.log('Login successful:', cred.user);
    this.errorMessage='';

    //get user info from Firebase
    this.firebaseService.getUserbyUID(cred.user.uid)
    .then(userData => {
      const name = userData.displayName || 'Bruger';
      localStorage.setItem('uid', cred.user.uid);
      localStorage.setItem('playerName',name);
    })
    .catch(() => {
      localStorage.setItem('uid', cred.user.uid);
      localStorage.setItem('playerName', cred.user.displayName || 'Bruger');
    })
    .finally(() => {
     
      //go to dashboard and force refresh
      this.router.navigate(['/dashboard']).then(() => {
        location.reload();
      });
    });
  }

  //what happens on error
  private afterError(error:any):void {
    console.error('Error during login:', error.code, error.errorMessage);
    this.errorMessage= 'Login failed: ' + error.errorMessage;
  }

  //navigate to other pages
  goToSignup():void {this.router.navigate(['/signup']);}
  forgotPassword(): void {this.router.navigate(['/forgot-password']); }
  
}
