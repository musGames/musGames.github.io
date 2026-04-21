import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database, ref, get } from 'firebase/database';
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

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getDatabase(this.app);
    this.storage = getStorage(this.app);
  }

  // Bruges i din component
  getDatabase(): Database {
    return this.db;
  }

  // Henter highscores for valgt spil
  getHighscoresForGame(gameId: string): Promise<any[]> {
    const highscoresRef = ref(this.db, 'highscores/');

    return get(highscoresRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        return Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(score => score.games_Id === gameId);
      }

      return [];
    });
  }
}