import { Component, OnInit } from '@angular/core';
import { DifficultyEnum } from './enums/difficulty.enum';
import { GameService } from './services/game.service';
import { ITile } from './interfaces/tile.interface';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { IEndGame } from './interfaces/end-game.interface';
import { config } from './board/config/game.config';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public difficulties = config;
    public rows: ITile[][];
    public endGame: IEndGame = null;

    constructor(private gameService: GameService) {
    }

    public ngOnInit(): void {
        this.newGame();
        this.gameService.isGameOver()
        .pipe(
            distinctUntilChanged(),
            tap(endGame => {
                console.log('endGame', endGame);
                if (endGame.isGameOver) {
                    this.gameService.revealBoard();
                }
            }),
        )
        .subscribe(endGame => this.endGame = endGame);
    }

    public setDifficulty(difficulty: DifficultyEnum) {
        this.newGame(difficulty);
    }

    private newGame(difficulty?: DifficultyEnum) {
        this.rows = this.gameService.newGame(difficulty);
    }
}
