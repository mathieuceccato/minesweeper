import {Component, OnInit} from '@angular/core';

import {tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';

import {config} from './board/config/game.config';

import {GameService} from './services/game.service';

import {DifficultyEnum} from './enums/difficulty.enum';

import {ITile} from './interfaces/tile.interface';
import {IEndGame} from './interfaces/end-game.interface';
import {IGameConfig} from './interfaces/game-config.interface';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public difficulties: IGameConfig[] = config;
    public rows: ITile[][];
    public endGame: IEndGame = null;
    public currentDifficulty: IGameConfig = config[0];
    public minesLeft: number = this.currentDifficulty.mines;


    constructor(private gameService: GameService) {
    }

    public ngOnInit(): void {
        this.newGame();
        combineLatest(
            this.gameService.isGameOver(),
            this.gameService.getTotalFlagged(), // mines left
        )
        .pipe(
            tap(([endGame, shouldFlag]) => {
                if (endGame.isGameOver) {
                    this.gameService.revealBoard(endGame.reason);
                }

                this.calculateMinesLeft(shouldFlag);
            }),
        )
        .subscribe(([endGame]) => this.endGame = endGame);
    }

    public setDifficulty(difficulty: IGameConfig) {
        this.currentDifficulty = difficulty;
        this.newGame(difficulty.difficulty);
    }

    private newGame(difficulty?: DifficultyEnum) {
        this.rows = this.gameService.newGame(difficulty);
        this.minesLeft = this.currentDifficulty.mines;
    }

    private calculateMinesLeft(shouldFlag: number): void {
        if (this.minesLeft + shouldFlag < 0) {
            return;
        }

        this.minesLeft = this.minesLeft + shouldFlag;
    }
}
