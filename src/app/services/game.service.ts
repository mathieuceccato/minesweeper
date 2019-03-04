import { Injectable } from '@angular/core';
import { TileService } from './tile.service';
import { DifficultyEnum } from '../enums/difficulty.enum';
import { IBoard } from '../interfaces/board.interface';
import { Tile } from '../class/tile.class';
import { ITile } from '../interfaces/tile.interface';
import { MinesEnum } from '../enums/mines.enum';


@Injectable({
    providedIn: 'root',
})
export class GameService implements IBoard {
    public timer: number = 0;
    public gameHasStarted: boolean = false;
    public rows: ITile[][];
    public difficulty: DifficultyEnum = DifficultyEnum.EASY;

    constructor() {
    }

    public newGame(): void {
        console.log('this.difficulty', this.difficulty);
        this.timer = 0;
        this.gameHasStarted = false;

        this.initRows(this.difficulty);
        this.setMines();
        this.calculateValues();
    }

    public propagateDiscovery(y, x): void {
        if (this.rows[y] && this.rows[y][x] && !this.rows[y][x].isClicked) {
            this.rows[y][x].isClicked = true;

            if (this.rows[y][x].value === 0) {
                this.propagateDiscovery(y - 1, x - 1);
                this.propagateDiscovery(y - 1, x);
                this.propagateDiscovery(y - 1, x + 1);
                this.propagateDiscovery(y, x - 1);
                this.propagateDiscovery(y, x + 1);
                this.propagateDiscovery(y + 1, x - 1);
                this.propagateDiscovery(y + 1, x);
                this.propagateDiscovery(y + 1, x + 1);
            }
        }
    }

    private initRows(difficulty: DifficultyEnum): void {
        const rows = Array.from({ length: difficulty }, () => []);

        this.rows = rows.map(() => {
            return Array.from({ length: difficulty }, () => new Tile());
        });
    }

    private setMines(): void {
        for (let minesSettled = 0; minesSettled < MinesEnum.EASY;) {
            const rand1 = Math.floor(Math.random() * this.difficulty);
            const rand2 = Math.floor(Math.random() * this.difficulty);

            if (!this.rows[rand1][rand2].isMine) {
                minesSettled++;
                this.rows[rand1][rand2].setMine();
            }
        }
    }

    private calculateValues(): void {
        this.rows.forEach((row, y) => {
            row.forEach((tile, x) => {

                if (!tile.isMine) {
                    tile.value = this.countMinesAround(y, x);
                }
            });
        });
    }

    private countMinesAround(y, x): number {
        const max = this.difficulty - 1;
        let minesAround = 0;

        if (y > 0) {
            if (x > 0) {
                if (this.rows[y - 1][x - 1].isMine) minesAround++;
            }
            if (x < max) {
                if (this.rows[y - 1][x + 1].isMine) minesAround++;
            }
            if (this.rows[y - 1][x].isMine) minesAround++;
        }

        if (x > 0) {
            if (this.rows[y][x - 1].isMine) minesAround++;
        }
        if (x < max) {
            if (this.rows[y][x + 1].isMine) minesAround++;
        }

        if (y < max) {
            if (x > 0) {
                if (this.rows[y + 1][x - 1].isMine) minesAround++;
            }
            if (x < max) {
                if (this.rows[y + 1][x + 1].isMine) minesAround++;
            }
            if (this.rows[y + 1][x].isMine) minesAround++;
        }

        return minesAround;
    }
}
