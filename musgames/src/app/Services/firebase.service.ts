import { Injectable } from '@angular/core';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environment/environment'; 

const app = initializeApp(environment.firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Auth persistence set to LOCAL');
  })
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  currentUser: any = null;

  constructor() {
    this.listenToAuthStateChanges();
  }

  getAuth() {
    return auth;
  }

  getDatabase() {
    return database;
  }

  loginUser(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(auth);
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Password reset email sent.');
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        throw error;
      });
  }

  private listenToAuthStateChanges(): void {
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user ? user : null;
    });
  }

  getAuthStateListener(callback: (user: any) => void): void {
    onAuthStateChanged(auth, callback);
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  getUserbyUID(uid: string): Promise<any> {
    const userRef = ref(database, 'users/' + uid);

    return get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          throw new Error('User not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        throw error;
      });
  }
}