/*
  dashboardet
  firebase data bliver kun hentet i browseren så SSR ikke henter spillene på serveren
  changeDetectorRef bruges til at tvinge dashboardet til at vise firebase data efter det er hentet
  featured carousel bruger activeFeaturedIndex så den dynamisk kan skifte mellem hvert game card
*/

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
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
export class DashboardComponent implements OnInit, OnDestroy {
  isAdmin = false;

  games: any[] = [];
  latestGames: any[] = [];
  popularGames: any[] = [];
  featuredGames: any[] = [];

  activeFeaturedIndex = 0;

  private featuredAutoScrollTimer: ReturnType<typeof setInterval> | null = null;
  private readonly featuredAutoScrollMilliseconds = 4000;

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

  ngOnDestroy(): void {
    this.stopFeaturedAutoScroll();
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
        this.featuredGames = allGames.slice();

        this.latestGames = allGames
          .slice()
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 1);

        this.popularGames = allGames
          .filter(game => typeof game.plays === 'number')
          .sort((a, b) => b.plays - a.plays)
          .slice(0, 10);

        this.activeFeaturedIndex = 0;

        this.startFeaturedAutoScroll();

        console.log('Hentede spil fra Firebase:', this.games);

        this.changeDetectorRef.detectChanges();
      } else {
        this.games = [];
        this.latestGames = [];
        this.popularGames = [];
        this.featuredGames = [];
        this.activeFeaturedIndex = 0;

        this.stopFeaturedAutoScroll();

        console.log('Ingen spil fundet i databasen.');

        this.changeDetectorRef.detectChanges();
      }
    } catch (error) {
      console.error('Fejl ved indlæsning af spil:', error);

      this.stopFeaturedAutoScroll();

      this.changeDetectorRef.detectChanges();
    }
  }

  getFeaturedCardClass(index: number): string {
    const offset = this.getFeaturedOffset(index);

    if (offset === 0) {
      return 'featured-card featured-card-active';
    }

    if (offset === -1) {
      return 'featured-card featured-card-left-one';
    }

    if (offset === -2) {
      return 'featured-card featured-card-left-two';
    }

    if (offset === 1) {
      return 'featured-card featured-card-right-one';
    }

    if (offset === 2) {
      return 'featured-card featured-card-right-two';
    }

    return 'featured-card featured-card-hidden';
  }

  private getFeaturedOffset(index: number): number {
    const total = this.featuredGames.length;

    if (total === 0) {
      return 0;
    }

    let offset = index - this.activeFeaturedIndex;

    if (offset > total / 2) {
      offset -= total;
    }

    if (offset < -total / 2) {
      offset += total;
    }

    return offset;
  }

  nextFeaturedCard(): void {
    if (this.featuredGames.length === 0) {
      return;
    }

    this.activeFeaturedIndex++;

    if (this.activeFeaturedIndex >= this.featuredGames.length) {
      this.activeFeaturedIndex = 0;
    }

    this.restartFeaturedAutoScroll();

    this.changeDetectorRef.detectChanges();
  }

  previousFeaturedCard(): void {
    if (this.featuredGames.length === 0) {
      return;
    }

    this.activeFeaturedIndex--;

    if (this.activeFeaturedIndex < 0) {
      this.activeFeaturedIndex = this.featuredGames.length - 1;
    }

    this.restartFeaturedAutoScroll();

    this.changeDetectorRef.detectChanges();
  }

  private startFeaturedAutoScroll(): void {
    this.stopFeaturedAutoScroll();

    if (this.featuredGames.length <= 1) {
      return;
    }

    this.featuredAutoScrollTimer = setInterval(() => {
      this.moveFeaturedCardAutomatically();
    }, this.featuredAutoScrollMilliseconds);
  }

  private stopFeaturedAutoScroll(): void {
    if (this.featuredAutoScrollTimer !== null) {
      clearInterval(this.featuredAutoScrollTimer);
      this.featuredAutoScrollTimer = null;
    }
  }

  private restartFeaturedAutoScroll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.startFeaturedAutoScroll();
  }

  private moveFeaturedCardAutomatically(): void {
    if (this.featuredGames.length === 0) {
      return;
    }

    this.activeFeaturedIndex++;

    if (this.activeFeaturedIndex >= this.featuredGames.length) {
      this.activeFeaturedIndex = 0;
    }

    this.changeDetectorRef.detectChanges();
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement as HTMLElement;
      const firstCard = container.querySelector('.game-card') as HTMLElement | null;

      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const containerStyle = window.getComputedStyle(container);
        const gap = parseFloat(containerStyle.columnGap || containerStyle.gap || '0');

        container.scrollBy({
          left: -(cardWidth + gap),
          behavior: 'smooth'
        });
      }
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement as HTMLElement;
      const firstCard = container.querySelector('.game-card') as HTMLElement | null;

      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const containerStyle = window.getComputedStyle(container);
        const gap = parseFloat(containerStyle.columnGap || containerStyle.gap || '0');

        container.scrollBy({
          left: cardWidth + gap,
          behavior: 'smooth'
        });
      }
    }
  }

  deleteGame(gameId: string): void {
    if (confirm('Er du sikker på, at du vil slette dette spil?')) {
      this.firebaseService.deleteGame(gameId)
        .then(() => {
          this.games = this.games.filter(game => game.id !== gameId);
          this.latestGames = this.latestGames.filter(game => game.id !== gameId);
          this.popularGames = this.popularGames.filter(game => game.id !== gameId);
          this.featuredGames = this.featuredGames.filter(game => game.id !== gameId);

          if (this.activeFeaturedIndex >= this.featuredGames.length) {
            this.activeFeaturedIndex = 0;
          }

          this.restartFeaturedAutoScroll();

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
            console.log(`Tilføjede 'plays: 0' til spillet ${game.title}`);
          }
        }

        await Promise.all(updates);

        if (updates.length === 0) {
          console.log('Alle spil har allerede feltet "plays".');
        } else {
          console.log(`Tilføjede 'plays' til ${updates.length} spil.`);
        }

        this.changeDetectorRef.detectChanges();
      } else {
        console.log('Der findes ingen spil i databasen.');

        this.changeDetectorRef.detectChanges();
      }
    } catch (error) {
      console.error('Fejl ved tilføjelse af "plays"-felter:', error);

      this.changeDetectorRef.detectChanges();
    }
  }
}