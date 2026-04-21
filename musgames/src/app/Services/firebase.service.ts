import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
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

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getDatabase(this.app);
    this.storage = getStorage(this.app);
  }
/* Lavet af Martin 25-03-2025 */
  /* bare så resten af koden stadig kan bruge samme måde som før */
  getAuth() {
    return this.auth;
  }

  /* samme her så dashboardet kan hente databasen uden at du skal lave alt om */
  getDatabase() {
    return this.db;
  }

  /* tjekker om den bruger der er logget ind er admin */
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

  /* henter alle spil fra games og henter deres game_id*/
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

  /* hvis plays mangler på et spil så bliver det sat til 0 så dashboardet ikke rammer noget undefined */
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

  /* sletter et spil ud fra dets id */
  deleteGame(gameId: string): Promise<void> {
    return set(ref(this.db, `games/${gameId}`), null);
  }
  /* Lavet af Martin 25-03-2025 */
}