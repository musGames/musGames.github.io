import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { get, ref, onValue} from 'firebase/database';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard implements OnInit {

  highscores: any[] = [];
  games: any [] = [];
  selectedGameId: string = "";

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.loadGames();
  }

  async loadGames() {

    const gamesRef = ref(this.firebaseService.getDatabase(), 'games/');
    const snapshot = await get(gamesRef);

    if (snapshot.exists()) {
      this.games = Object.keys(snapshot.val()).map(key => {
        return { id: key, name: snapshot.val()[key].title };
      });

      this.cdr.detectChanges();
    } else {
      console.log("Ingen spil fundet i firebase");
    }
  }

  async loadHighscores() {
    if (this.selectedGameId) {
      this.firebaseService.getHighscoresForGame(this.selectedGameId)
      .then(highscores => {
        this.highscores = this.highscores.sort((a, b) => b.score - a.score);
        this.cdr.detectChanges();
      });
    }
  }

  listenForHighscoreUpdates() {
    if (this.selectedGameId) {
      const highscoresRef = ref (this.firebaseService.getDatabase(), 'highscores/');

      onValue(highscoresRef, (snapshot) => {
        if (snapshot.exists()) {
          const highscoresData = snapshot.val();
          this.highscores = [];

          for (let id in highscoresData) {
            const data = highscoresData[id];

            if (data.games_Id === this.selectedGameId) {
              this.highscores.push({
                displayName: data.displayName,
                gameTitle: data.gameTitle,
                score: data.score
              });
            }
          }

          this.highscores.sort((a, b) => b.score - a.score);
          this.cdr.detectChanges();
        }
      });
    }
  }

}