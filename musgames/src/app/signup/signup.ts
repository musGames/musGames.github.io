import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  //user information 
  name: string= '';
  email: string='';
  emailConfirm: string='';
  password: string='';
  passwordConfirm: string='';

constructor(private firebaseService: FirebaseService, private router: Router){}

//update name 
updateName(event:any): void{
  this.name=event.target.value;

}

//update email
updateEmail(event:any): void{
  this.email=event.target.value;
}

//update email confirmation
updateEmailConfirm(event:any):void{
  this.emailConfirm= event.target.value;
}

//update the password
updatePassword(event:any):void{
  this.password= event.target.value;
}

//update password confirmation
updatePasswordConfirm(event:any):void{
  this.passwordConfirm=event.target.value;
}

//check if any input is empty
register(): void{
  if(!this.name || !this.email || !this.emailConfirm || !this.password || !this.passwordConfirm){
    alert('All fields are requiered')
    return;
  }


  //check if both emails are same
if(this.email !== this.emailConfirm){
  alert('Emails do not match');
  return;
}

//check if both pass are same
if(this.password !== this.passwordConfirm){
  alert('Passwords do not match');
  return;
}


const isAdmin=false; // set true if you want user to be an admin

//create normal user acc
this.firebaseService.registerUser(this.email, this.password, this.name)
.then(() => {
  confirm('Signup successful! Please check your email for the verification link');

      window.location.href = '/#/login';
    })
  .catch((error) => {
    console.error('Signup error:', error);
    alert('Signup failed: ' + (error?.message || error?.code || 'Unknown error'));
  });

}

//goes to login page
goToLogin(): void{
  this.router.navigate(['/login']);
      window.location.href = '/#/login';



}

}
