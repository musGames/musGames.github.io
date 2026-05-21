import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService, private router: Router) {}
/* Martin 25-03-2025 */
  async canActivate(): Promise<boolean> {
    const auth = getAuth();
    return new Promise<boolean>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();

        if (!user) {
          this.router.navigate(['/login']);
          resolve(false);
          return;
        }

        const isAdmin = await this.firebaseService.checkIfAdmin(user.uid);
        if (!isAdmin) {
          this.router.navigate(['/login']);
          resolve(false);
          return;
        }

        resolve(true);
      });
    });
  }
}
