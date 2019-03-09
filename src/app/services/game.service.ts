import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Tile } from '../class/tile.class';
import { ITile } from '../interfaces/tile.interface';
import { IBoard } from '../interfaces/board.interface';
import { ICoords } from '../interfaces/coords.interface';
import { DifficultyEnum } from '../enums/difficulty.enum';
import { config } from '../board/config/game.config';
import { IGameConfig } from '../interfaces/game-config.interface';


@Injectable({
    providedIn: 'root',
})
export class GameService implements IBoard {
    public timer: number = 0;
    public gameHasStarted: boolean = false;
    public rows: ITile[][];

    private _isGameOver: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private minesCoords: ICoords[] = [];
    private selectedConfig: IGameConfig;

    constructor() {
    }

    public isGameOver(): BehaviorSubject<boolean> {
        return this._isGameOver;
    }

    public set shouldEndGame(value: boolean) {
        this._isGameOver.next(value); // todo: win / loose ?
    }

    public newGame(difficulty = DifficultyEnum.EASY): ITile[][] {
        this.timer = 0;
        this.minesCoords = [];
        this.gameHasStarted = false;
        this.shouldEndGame = false;
        this.selectedConfig = config[difficulty];

        this.initRows();
        this.setMines();
        this.calculateValues();

        return this.rows;
    }

    public propagateDiscovery(y: number, x: number, shouldBypass?: boolean): void {
        if (this.rows[y] && this.rows[y][x] && !this.rows[y][x].isFlagged) {

            if ((this.rows[y][x].value === 0 && !this.rows[y][x].isClicked) || (this.rows[y][x].isClicked && shouldBypass)) {
                this.rows[y][x].isClicked = true;

                this.propagateDiscovery(y - 1, x - 1);
                this.propagateDiscovery(y - 1, x);
                this.propagateDiscovery(y - 1, x + 1);
                this.propagateDiscovery(y, x - 1);
                this.propagateDiscovery(y, x + 1);
                this.propagateDiscovery(y + 1, x - 1);
                this.propagateDiscovery(y + 1, x);
                this.propagateDiscovery(y + 1, x + 1);
            }

            this.rows[y][x].isClicked = true;

            if (this.rows[y][x].isMine) {
                this.shouldEndGame = true;

                return;
            }
        }
    }

    public countMinesAround(y, x): number {
        const yMax = this.selectedConfig.yRows - 1;
        const xMax = this.selectedConfig.xRows - 1;
        let minesAround = 0;

        if (y > 0) {
            if (x > 0) {
                if (this.rows[y - 1][x - 1].isMine) {
                    minesAround++;
                }
            }
            if (x < xMax) {
                if (this.rows[y - 1][x + 1].isMine) {
                    minesAround++;
                }
            }
            if (this.rows[y - 1][x].isMine) {
                minesAround++;
            }
        }

        if (x > 0) {
            if (this.rows[y][x - 1].isMine) {
                minesAround++;
            }
        }
        if (x < xMax) {
            if (this.rows[y][x + 1].isMine) {
                minesAround++;
            }
        }

        if (y < yMax) {
            if (x > 0) {
                if (this.rows[y + 1][x - 1].isMine) {
                    minesAround++;
                }
            }
            if (x < xMax) {
                if (this.rows[y + 1][x + 1].isMine) {
                    minesAround++;
                }
            }
            if (this.rows[y + 1][x].isMine) {
                minesAround++;
            }
        }

        return minesAround;
    }

    public revealMines(): void {
        this.minesCoords.forEach(({ y, x }) => this.rows[y][x].isClicked = true);
    }

    private initRows(): void {
        this.rows = Array.from({ length: this.selectedConfig.yRows });

        for (let y = 0; y < this.selectedConfig.yRows; y++) {
            this.rows[y] = Array.from({ length: this.selectedConfig.xRows }, () => new Tile());
        }
    }

    private setMines(): void {
        for (let minesSettled = 0; minesSettled < this.selectedConfig.mines;) {
            const rand1 = Math.floor(Math.random() * this.selectedConfig.yRows);
            const rand2 = Math.floor(Math.random() * this.selectedConfig.xRows);

            if (!this.rows[rand1][rand2].isMine) {
                minesSettled++;
                this.rows[rand1][rand2].setMine();
                this.minesCoords.push({ y: rand1, x: rand2 });
            }
        }
    }

    private calculateValues(): void {
        for (let y = 0; y < this.selectedConfig.yRows; y++) {
            for (let x = 0; x < this.selectedConfig.xRows; x++) {
                if (!this.rows[y][x].isMine) {
                    this.rows[y][x].value = this.countMinesAround(y, x);
                }
            }
        }
    }
}
