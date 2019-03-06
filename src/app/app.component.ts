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

    private difficulty: DifficultyEnum = DifficultyEnum.EASY;

    constructor(private gameService: GameService) {
        console.log('this.difficulties', this.difficulties);
    }

    public ngOnInit(): void {
        this.gameService.newGame();
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

    public newGame() {
        if (this.gameService.gameHasStarted) {
            return;
        }

        this.gameService.newGame();
        this.rows = this.gameService.rows;
    }

    public setDifficulty(difficulty: DifficultyEnum) {
        this.gameService.difficulty = difficulty;
    }
}
