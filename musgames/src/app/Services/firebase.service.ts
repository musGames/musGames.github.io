import { Injectable } from '@angular/core';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence
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

  // Get the Firebase Auth instance
  getAuth() {
    return auth;
  }

  // Get the Firebase Database instance
  getDatabase() {
    return database;
  }

  // Login with email + password
  loginUser(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout current user
  logout(): Promise<void> {
    return signOut(auth);
  }

  // Auth state listener
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

  // Get user data by UID
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