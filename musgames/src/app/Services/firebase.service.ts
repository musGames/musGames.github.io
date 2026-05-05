import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  updatePassword
} from 'firebase/auth';
import { getDatabase, Database, ref, get, update, set, push, onChildAdded, remove } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { environment } from '../../environment/environment';
import { BehaviorSubject } from 'rxjs';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public app: FirebaseApp;
  public auth: Auth;
  public db: Database;
  public storage: FirebaseStorage;
  public currentUser: any = null;

  private displayNameSubject = new BehaviorSubject<string>('');
  public currentDisplayName$ = this.displayNameSubject.asObservable();

  public currentDisplayName: string = '';

  private displayNameSubject = new BehaviorSubject<string>('');
  public currentDisplayName$ = this.displayNameSubject.asObservable();
  public currentDisplayName: string = '';

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getDatabase(this.app);
    this.storage = getStorage(this.app);

    setPersistence(this.auth, browserLocalPersistence)
      .then(() => console.log('Auth persistence set to LOCAL'))
      .catch((error) => console.error('Error setting auth persistence:', error));

    this.listenToAuthStateChanges();
  }

  getAuth() {
    return this.auth;
  }

  getDatabase() {
    return this.db;
  }

  registerUser(email: string, password: string, displayName: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        return updateProfile(user, { displayName }).then(() => {
          return sendEmailVerification(user).then(() => {
            const isAdmin = FirebaseService.isHardcodedAdmin(email);

            return this.createUser(user.uid, displayName, email, isAdmin).then(() => ({
              uid: user.uid,
              isAdmin
            }));
          });
        });
      });
  }

  createUser(uid: string, displayName: string, email: string, isAdmin: boolean): Promise<void> {
    return set(ref(this.db, `users/${uid}`), {
      displayName,
      email,
      isAdmin,
      createdAt: new Date().toISOString()
    });
  }

  private static isHardcodedAdmin(email: string): boolean {
    const adminEmails = ['celynflacker@gmail.com'];
    return adminEmails.includes(email);
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

  createAdminRights(uid: string): Promise<void> {
    return update(ref(this.db, `users/${uid}`), {
      isAdmin: true
    });
  }

  revokeAdminRights(uid: string): Promise<void> {
    return update(ref(this.db, `users/${uid}`), {
      isAdmin: false
    });
  }

  getAllUsers(): Promise<any[]> {
    const usersRef = ref(this.db, 'users/');

    return get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();

        return Object.keys(usersData).map((uid) => ({
          uid,
          ...usersData[uid]
        }));
      }

      return [];
    });
  }

  deleteUser(uid: string): Promise<void> {
    return set(ref(this.db, `users/${uid}`), null);
  }

  loginUser(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    this.clearDisplayName();
    this.clearDisplayName();
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
        }

        throw new Error('User not found');
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        throw error;
      });
  }

  refreshDisplayName(uid: string): Promise<void> {
    return this.getUserbyUID(uid)
    .then((userData) => {
      if (userData && userData.displayName) {
        this.currentDisplayName = userData.displayName;
        this.displayNameSubject.next(userData.displayName);
      } else {
        this.currentDisplayName = '';
        this.displayNameSubject.next('');
      }
    })
    .catch((error) => {
      console.error('Error refreshing displayname:', error);
      this.currentDisplayName = '';
      this.displayNameSubject.next('');
    });
  }
  clearDisplayName(): void {
    this.currentDisplayName = '';
    this.displayNameSubject.next('');
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

  createGame(
    gameId: string,
    title: string,
    description: string,
    imageUrl: string,
    netlifyUrl: string,
    platform: string,
    userId: string
  ): Promise<void> {
    return set(ref(this.db, `games/${gameId}`), {
      title,
      description,
      imageUrl,
      netlifyUrl,
      platform,
      users_Id: userId,
      createdAt: new Date().toISOString(),
      plays: 0 
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
          }
        }

        await Promise.all(updates);
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

        return Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .filter((score) => score.games_Id === gameId);
      }

      return [];
    });
  }

  incrementPlays(gameId: string): Promise<void> {
    const gameRef = ref(this.db, `games/${gameId}`);

    return get(gameRef).then(snapshot => {
      if (!snapshot.exists()) throw new Error('Game not found');

      const gameData = snapshot.val();
      const currentPlays = typeof gameData.plays === 'number' ? gameData.plays : 0;

      return update(gameRef, {
        plays: currentPlays + 1,
        lastPlayedAt: new Date().toISOString()
      });
    });
  }

  submitHighscore(displayName: string, email: string, gameTitle: string, score: number, games_Id: string): Promise<void> {
    const highscoresRef = ref(this.db, 'highscores/');

    return get(highscoresRef).then(snapshot => {
      const allHighscores = snapshot.val();

      let existingKey: string | null = null;
      let existingScore: number = 0;

      if (allHighscores) {
        for (const key in allHighscores) {
          const entry = allHighscores[key];
          if (entry.displayName === displayName && entry.games_Id === games_Id) {
            existingKey = key;
            existingScore = entry.score;
            break;
          }
        }
      }

      if (existingKey) {
        if (score > existingScore) {
          console.log("⬆️ Ny score er højere – opdaterer.");
          console.log("Sender highscore:", { displayName, email, gameTitle, score, games_Id });

          return update(ref(this.db, `highscores/${existingKey}`), {
            score: score,
            email: email,
            timestamp: new Date().toISOString()
          });
        } else {
          console.log("⬇️ Ny score er lavere – ignorerer.");
          return Promise.resolve();
        }
      } else {
        console.log("🆕 Ingen tidligere score – opretter ny.");
        console.log("Sender highscore:", { displayName, email, gameTitle, score, games_Id });

        const newKey = Date.now();
        return set(ref(this.db, `highscores/${newKey}`), {
          displayName: displayName,
          email: email,
          gameTitle: gameTitle,
          score: score,
          games_Id: games_Id,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  sendMessage( message: Message): Promise<void> {
    const chatref = ref(this.db, `messages/`);

    return push(chatref, {
      text: message.text,
      displayName: message.displayName,
      timeStamp: message.timeStamp.toISOString(),
      gameId: message.gameId,
    }).then(() => {});
  }

  listenForMessages(callback: (message: Message) => void): void {
    const chatref = ref(this.db, `messages/`);
    
    onChildAdded(chatref, (snapshot) => {
      callback(snapshot.val());
    });
  }

  async cleanOldMessages() {
    const chatref = ref(this.db, `messages/`);

    try {
      const snapshot = await get(chatref);
      if (snapshot.exists()) {
        const messages = snapshot.val();
        const n = Date.now();

        Object.keys(messages).forEach(async (messageId) => {
          const message = messages[messageId];
          const messageTime = new Date(message.timeStamp).getTime();

          if (n - messageTime > 3600000) {
            await remove(ref(this.db, `messages/${messageId}`));
          }
        });
      }
    } catch (error) {
      console.error("Error cleaning messages:", error);
    }
  }

  updateGame(gameId: string, updates: { title?: string; description?: string; netlifyUrl?: string; imageUrl?: string }): Promise<void>
 {
    return update(ref(this.getDatabase(), `games/${gameId}`), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  updateDisplayName(uid: string, newDisplayName: string): Promise<void> {
    const authInstance = this.getAuth();
    const user = authInstance.currentUser;

    if (user && user.uid === uid) {
      return updateProfile(user, { displayName: newDisplayName })
        .then(() => {
          return update(ref(this.getDatabase(), `users/${uid}`), { displayName: newDisplayName });
        })
        .then(() => user.reload())
        .then(() => {
          console.log('Updated displayName:', newDisplayName);
          this.displayNameSubject.next(newDisplayName);
        })
        .catch(error => Promise.reject(error));
    } else {
      return Promise.reject('User not authenticated');
    }
  }

  refreshDisplayName(uid: string): Promise<void> {
    return this.getUserbyUID(uid)
      .then((userData) => {
        if (userData && userData.displayName) {
          this.currentDisplayName = userData.displayName;
          this.displayNameSubject.next(userData.displayName);
        } else {
          this.currentDisplayName = '';
          this.displayNameSubject.next('');
        }
      })
      .catch((error) => {
        console.error('Error refreshing displayName:', error);
        this.currentDisplayName = '';
      });
  }

  clearDisplayName(): void {
    this.currentDisplayName = '';
    this.displayNameSubject.next('');    
  }

  updateUserPassword(uid: string, newPassword: string): Promise<void> {
    const authInstance = this.getAuth();
    const user = authInstance.currentUser;
     
    if (user && user.uid === uid) {
      return updatePassword(user, newPassword);
    } else {
      return Promise.reject('User not authenticated');
    }
  }

  saveThemeSettings(uid: string, settings: { backgroundColor: string; navbarColor: string }) {
    document.body.style.backgroundColor = settings.backgroundColor;
    document.querySelector('.navbar')?.setAttribute('style', `background-color: ${settings.navbarColor}`);
    document.querySelector('.Navbar')?.setAttribute('style', `background-color: ${settings.navbarColor}`);
    document.querySelector('.sidebar')?.setAttribute('style', `background-color: ${settings.navbarColor}`);

    return set(ref(this.getDatabase(), `users/${uid}/theme`), settings);
  }
}