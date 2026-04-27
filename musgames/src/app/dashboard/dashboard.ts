/*
  dashboardet
  skrevet om så den ikke viser login besked 2 gange
*/

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirebaseService } from '../Services/firebase.service';
import { CommonModule } from '@angular/common';
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
  /* bruges bare til at vide om den der er logget ind er admin så admin ting kan vises eller skjules */
  isAdmin = false;

  games: any[] = [];
  latestGames: any[] = [];
  popularGames: any[] = [];

  @ViewChild('scrollContainer', { static: false })
  scrollContainer!: ElementRef;

  constructor(private firebaseService: FirebaseService) {}

  /* det her kører når dashboardet loader og så sætter den admin status og henter spillene og giver manglende plays feltet 0 */
  ngOnInit(): void {
    this.initializeAdminStatus();
    this.loadGamesFromFirebase();
    this.addMissingPlaysField();
  }

  /* tjekker den bruger der er logget ind lige nu og finder ud af om personen er admin */
  private initializeAdminStatus(): void {
    const current = getAuth().currentUser;

    if (current) {
      this.firebaseService.checkIfAdmin(current.uid)
        .then(status => this.isAdmin = status)
        .catch(err => {
          console.error('Error checking admin status in Dashboard:', err);
          this.isAdmin = false;
        });
    } else {
      /* hvis der ikke er nogen bruger så bliver den bare sat til false selvom det egentlig ikke burde ske */
      this.isAdmin = false;
    }
  }

  /* henter alle spil fra firebase og gemmer dem i games og laver også en liste med det nyeste spil og en med de mest spillede */
  async loadGamesFromFirebase() {
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

        /* tager alle spillene og sorterer dem efter hvornår de blev lavet så det nyeste kommer først og så tager den kun det første */
        this.latestGames = allGames
          .slice()
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 1);

        /* finder kun spil hvor plays faktisk er et tal og sorterer dem så dem med flest plays ligger øverst og tager kun top 10 */
        this.popularGames = allGames
          .filter(game => typeof game.plays === 'number')
          .sort((a, b) => b.plays - a.plays)
          .slice(0, 10);

        console.log('Hentede spil fra Firebase:', this.games);
      } else {
        console.log('Ingen spil fundet i databasen.');
      }
    } catch (error) {
      console.error('Fejl ved indlæsning af spil:', error);
    }
  }

  /* rykker scroll boksen mod venstre så man kan se de forrige cards */
  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  }

  /* rykker scroll boksen mod højre så man kan se de næste cards */
  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  }

  /* spørger først om man er sikker og hvis man er det så sletter den spillet og fjerner det også fra de arrays der allerede er vist på siden */
  deleteGame(gameId: string): void {
    if (confirm("Er du sikker på, at du vil slette dette spil?")) {
      this.firebaseService.deleteGame(gameId)
        .then(() => {
          this.games = this.games.filter(game => game.id !== gameId);
          this.latestGames = this.latestGames.filter(game => game.id !== gameId);
          this.popularGames = this.popularGames.filter(game => game.id !== gameId);
          console.log("Spillet blev slettet.");
        })
        .catch(error => {
          console.error("Fejl ved sletning af spil:", error);
        });
    }
  }

  /* går alle spil igennem og hvis et spil ikke har plays feltet så bliver det sat til 0 så resten af koden ikke fejler på det */
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

          /* hvis plays ikke allerede er et tal så opdaterer den spillet inde i databasen og giver det værdien 0 */
          if (typeof game.plays !== 'number') {
            const gameRef = ref(db, `games/${gameId}`);
            updates.push(update(gameRef, { plays: 0 }));
            console.log(`✅ Tilføjede 'plays: 0' til spillet ${game.title}`);
          }
        }

        await Promise.all(updates);

        /* hvis der ikke var noget at opdatere så siger den bare det og ellers skriver den hvor mange spil den har rettet */
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
}