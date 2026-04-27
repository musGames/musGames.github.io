import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getDatabase, Database, ref, get, update, set } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public app: FirebaseApp;
  public auth: Auth;
  public db: Database;
  public storage: FirebaseStorage;
  public currentUser: any = null;

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getDatabase(this.app);
    this.storage = getStorage(this.app);

    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        console.log('Auth persistence set to LOCAL');
      })
      .catch((error) => {
        console.error('Error setting auth persistence:', error);
      });

    this.listenToAuthStateChanges();
  }

  getAuth() {
    return this.auth;
  }

  getDatabase() {
    return this.db;
  }

  loginUser(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email)
      .then(() => {
        console.log('Password reset email sent.');
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        throw error;
      });
  }

  private listenToAuthStateChanges(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user ? user : null;
    });
  }

  getAuthStateListener(callback: (user: any) => void): void {
    onAuthStateChanged(this.auth, callback);
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  getUserbyUID(uid: string): Promise<any> {
    const userRef = ref(this.db, 'users/' + uid);

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

  checkIfAdmin(uid: string): Promise<boolean> {
    const userRef = ref(this.db, `users/${uid}`);

    return get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          return userData.isAdmin || false;
        }

        return false;
      })
      .catch((error) => {
        console.error('Error checking admin status:', error);
        return false;
      });
  }

  getAllGames(): Promise<any[]> {
    const gamesRef = ref(this.db, 'games');

    return get(gamesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          return Object.keys(data).map((key) => ({
            id: key,
            ...data[key]
          }));
        }

        return [];
      })
      .catch((error) => {
        console.error('Fejl ved hentning af spil:', error);
        throw error;
      });
  }

  async addMissingPlaysField(): Promise<void> {
    try {
      const gamesRef = ref(this.db, 'games');
      const snapshot = await get(gamesRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const updates: Promise<void>[] = [];

        for (const gameId in data) {
          const game = data[gameId];

          if (typeof game.plays !== 'number') {
            const gameRef = ref(this.db, `games/${gameId}`);
            updates.push(update(gameRef, { plays: 0 }));
            console.log(`✅ Tilføjede 'plays: 0' til spillet ${game.title}`);
          }
        }

        await Promise.all(updates);

        if (updates.length === 0) {
          console.log('Alle spil har allerede feltet "plays".');
        } else {
          console.log(`🎉 Tilføjede 'plays' til ${updates.length} spil.`);
        }
      } else {
        console.log('⚠️ Der findes ingen spil i databasen.');
      }
    } catch (error) {
      console.error('❌ Fejl ved tilføjelse af "plays"-felter:', error);
    }
  }

  deleteGame(gameId: string): Promise<void> {
    return set(ref(this.db, `games/${gameId}`), null);
  }

    getHighscoresForGame(gameId: string): Promise<any[]> {
    const highscoresRef = ref(this.getDatabase(), 'highscores/');
    return get(highscoresRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const filtered = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(score => score.games_Id === gameId);
  
        return filtered;
      }
      return [];
    });
  }
}