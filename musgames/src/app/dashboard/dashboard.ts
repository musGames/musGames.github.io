/*
  dashboardet
  skrevet om så den ikke viser login besked 2 gange
  firebase data bliver kun hentet i browseren så SSR ikke henter spillene på serveren
  changeDetectorRef bruges til at tvinge dashboardet til at vise firebase data efter det er hentet
*/

import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { get, ref, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  isAdmin = false;

  games: any[] = [];
  latestGames: any[] = [];
  popularGames: any[] = [];

  @ViewChild('scrollContainer', { static: false })
  scrollContainer!: ElementRef;

  constructor(
    private firebaseService: FirebaseService,
    @Inject(PLATFORM_ID) private platformId: object,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAdminStatus();
      this.loadGamesFromFirebase();
      this.addMissingPlaysField();
    }
  }

  private initializeAdminStatus(): void {
    const current = getAuth().currentUser;

    if (current) {
      this.firebaseService.checkIfAdmin(current.uid)
        .then(status => {
          this.isAdmin = status;
          this.changeDetectorRef.detectChanges();
        })
        .catch(err => {
          console.error('Error checking admin status in Dashboard:', err);
          this.isAdmin = false;
          this.changeDetectorRef.detectChanges();
        });
    } else {
      this.isAdmin = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  async loadGamesFromFirebase(): Promise<void> {
    try {
      const db = this.firebaseService.getDatabase();
      const gamesRef = ref(db, 'games');
      const snapshot = await get(gamesRef);

      if (snapshot.exists()) {
        const data = snapshot.val();

        const allGames = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        this.games = allGames;

        this.latestGames = allGames
          .slice()
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 1);

        this.popularGames = allGames
          .filter(game => typeof game.plays === 'number')
          .sort((a, b) => b.plays - a.plays)
          .slice(0, 10);

        console.log('Hentede spil fra Firebase:', this.games);

        this.changeDetectorRef.detectChanges();
      } else {
        this.games = [];
        this.latestGames = [];
        this.popularGames = [];

        console.log('Ingen spil fundet i databasen.');

        this.changeDetectorRef.detectChanges();
      }
    } catch (error) {
      console.error('Fejl ved indlæsning af spil:', error);

      this.changeDetectorRef.detectChanges();
    }
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  }

  deleteGame(gameId: string): void {
    if (confirm('Er du sikker på, at du vil slette dette spil?')) {
      this.firebaseService.deleteGame(gameId)
        .then(() => {
          this.games = this.games.filter(game => game.id !== gameId);
          this.latestGames = this.latestGames.filter(game => game.id !== gameId);
          this.popularGames = this.popularGames.filter(game => game.id !== gameId);

          console.log('Spillet blev slettet.');

          this.changeDetectorRef.detectChanges();
        })
        .catch(error => {
          console.error('Fejl ved sletning af spil:', error);

          this.changeDetectorRef.detectChanges();
        });
    }
  }

  async addMissingPlaysField(): Promise<void> {
    try {
      const db = this.firebaseService.getDatabase();
      const gamesRef = ref(db, 'games');
      const snapshot = await get(gamesRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const updates: Promise<void>[] = [];

        for (const gameId in data) {
          const game = data[gameId];

          if (typeof game.plays !== 'number') {
            const gameRef = ref(db, `games/${gameId}`);
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

        this.changeDetectorRef.detectChanges();
      } else {
        console.log('⚠️ Der findes ingen spil i databasen.');

        this.changeDetectorRef.detectChanges();
      }
    } catch (error) {
      console.error('❌ Fejl ved tilføjelse af "plays"-felter:', error);

      this.changeDetectorRef.detectChanges();
    }
  }
}