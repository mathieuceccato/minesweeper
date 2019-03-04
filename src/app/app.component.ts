import { Component, OnInit } from '@angular/core';
import { DifficultyEnum } from './enums/difficulty.enum';
import { GameService } from './services/game.service';
import { ITile } from './interfaces/tile.interface';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public difficulties: DifficultyEnum[] = [DifficultyEnum.EASY, DifficultyEnum.MEDIUM, DifficultyEnum.HARD];
    public rows: ITile[][];
    private difficulty: DifficultyEnum = DifficultyEnum.EASY;

    constructor(private gameService: GameService) {
        console.log('this.difficulties', this.difficulties);
    }

    public ngOnInit(): void {
        this.gameService.newGame();
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
