import { Component, OnInit } from '@angular/core';
import { DifficultyEnum } from './enums/difficulty.enum';
import { GameService } from './services/game.service';
import { ITile } from './interfaces/tile.interface';
import { distinctUntilChanged, tap } from 'rxjs/operators';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public difficulties: DifficultyEnum[] = [DifficultyEnum.EASY, DifficultyEnum.MEDIUM, DifficultyEnum.HARD];
    public rows: ITile[][];
    public gameIsOver: boolean = false;

    constructor(private gameService: GameService) {
    }

    public ngOnInit(): void {
        this.newGame();
        this.gameService.isGameOver()
        .pipe(
            distinctUntilChanged(),
            tap(gameIsOver => {
                console.log('gameIsOver', gameIsOver);
                if (gameIsOver) {
                    this.gameService.revealMines();
                }
            }),
        )
        .subscribe(gameIsOver => this.gameIsOver = gameIsOver);
    }

    public setDifficulty(difficulty: DifficultyEnum) {
        this.newGame(difficulty);
    }

    private newGame(difficulty?: DifficultyEnum) {
        this.rows = this.gameService.newGame(difficulty);
    }
}
