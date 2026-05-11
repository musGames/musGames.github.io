import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.html',
  styleUrl: './logout.css',
})
export class Logout {
  isLoggingOut: boolean = false;

  constructor(private router: Router) {}

  async logout(): Promise<void> {
    if (this.isLoggingOut) return;

    this.isLoggingOut = true;

    try {
      localStorage.clear();
      sessionStorage.clear();

      await signOut(getAuth());

      await this.router.navigateByUrl('/login', { replaceUrl: true });

      window.location.reload();

    } catch (error) {
      console.error('Logout error:', error);

      await this.router.navigateByUrl('/login', { replaceUrl: true });
      window.location.reload();
    }
  }
}