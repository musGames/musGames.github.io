import { Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './services/firebase.service'; // Make sure this is correct

import { RouterModule } from '@angular/router';  // Import RouterModule
import { CommonModule } from '@angular/common';  // Import CommonModule for directives like *ngIf
import { NavbarComponent } from './navbar/navbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterModule, CommonModule, NavbarComponent],  // Add CommonModule here
  styleUrls: ['./app.css']
})
//selin 2025-03-2025
export class App {
  showNavbar = true;

  constructor(private router: Router) {
    router.events.subscribe(() => {
      const noNavbarRoutes = ['/', '/login', '/admin-login', '/home', '/signup', '/forgot-password' ];
      this.showNavbar = !noNavbarRoutes.includes(this.router.url);
    });
  }

  
}

//selin 2025-03-2025
