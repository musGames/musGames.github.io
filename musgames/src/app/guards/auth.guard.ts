import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): Promise<boolean> {
    const auth = getAuth();

    return new Promise<boolean>((resolve) => {
      let resolved = false;

      const finish = (allowed: boolean) => {
        if (!resolved) {
          resolved = true;
          resolve(allowed);
        }
      };

      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          if (user) {
            unsubscribe();
            finish(true);
          }
        },
        (error) => {
          console.error('AuthGuard-fejl:', error);
          unsubscribe();
          this.router.navigate(['/login']);
          finish(false);
        }
      );

      setTimeout(() => {
        unsubscribe();
        if (auth.currentUser) {
          finish(true);
        } else {
          this.router.navigate(['/login']);
          finish(false);
        }
      }, 3000);
    });
  }
}
