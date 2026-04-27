import { CommonModule } from '@angular/common';
import { Component,NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../Services/firebase.service';
import { NgModel } from '@angular/forms';
@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
email: string = ''; //email input
errorMessage: string = '';  //holds error messages
isError: boolean = false;

constructor(private router: Router, private firebaseService: FirebaseService) {}

//update email as user types
sendEmail(event: Event){
  this.email = (event.target as HTMLInputElement).value;
}

//send password reset email
resetPassword(){

  if(!this.email){
    this.errorMessage= 'Please enter your email';
    return;
  }

//call firebase service to send password reset email
this.firebaseService.resetPassword(this.email)
.then(() => {
  
  alert('Password reset email sent!');
  this.router.navigate(['/login']);
  
})
.catch(err => {
  this.errorMessage = err.message || 'Error sending reset email';
});
}

//navigate manually back to login
goToLogin(){
  this.router.navigate(['/login']);
}
}
