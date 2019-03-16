import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {Tile} from '../class/tile.class';
import {ITile} from '../interfaces/tile.interface';
import {IBoard} from '../interfaces/board.interface';
import {ICoords} from '../interfaces/coords.interface';
import {DifficultyEnum} from '../enums/difficulty.enum';
import {config} from '../board/config/game.config';
import {IGameConfig} from '../interfaces/game-config.interface';
import {IEndGame} from '../interfaces/end-game.interface';
import {EndGameEnum} from '../enums/end-game.enum';


export type TileKey = 'isMine' | 'isFlagged';

@Injectable({
    providedIn: 'root',
})
export class GameService implements IBoard {
    public timer: number = 0;
    public gameHasStarted: boolean = false;
    public rows: ITile[][];
    public totalFlagged: number = 0;

    private totalClicked: number = 0;
    private _isGameOver: BehaviorSubject<IEndGame> = new BehaviorSubject(null);
    private minesCoords: ICoords[] = [];
    private selectedConfig: IGameConfig;

    constructor() {
    }

    public isGameOver(): BehaviorSubject<IEndGame> {
        return this._isGameOver;
    }

    public set shouldEndGame(value: IEndGame) {
        this._isGameOver.next(value);
    }

    public newGame(difficulty = DifficultyEnum.EASY): ITile[][] {
        this.timer = 0;
        this.totalFlagged = 0;
        this.minesCoords = [];
        this.gameHasStarted = false;
        this.shouldEndGame = {isGameOver: false};
        this.selectedConfig = config[difficulty];

        this.initRows();
        this.setMines();
        this.calculateValues();

        return this.rows;
    }

    public propagateDiscovery(y: number, x: number, shouldBypass?: boolean): void {
        if (this.rows[y] && this.rows[y][x] && !this.rows[y][x].isFlagged) {

            if ((this.rows[y][x].value === 0 && !this.rows[y][x].isClicked) || (this.rows[y][x].isClicked && shouldBypass)) {
                setTimeout(() => {
                    this.rows[y][x].isClicked = true;

                    this.propagateDiscovery(y - 1, x - 1);
                    this.propagateDiscovery(y - 1, x);
                    this.propagateDiscovery(y - 1, x + 1);
                    this.propagateDiscovery(y, x - 1);
                    this.propagateDiscovery(y, x + 1);
                    this.propagateDiscovery(y + 1, x - 1);
                    this.propagateDiscovery(y + 1, x);
                    this.propagateDiscovery(y + 1, x + 1);
                }, 30);
            }

            this.rows[y][x].isClicked = true;

            if (this.rows[y][x].isMine) {
                this.shouldEndGame = {isGameOver: true, reason: EndGameEnum.LOOSE};

                return;
            }
        }
    }

    public countAroundTile(y, x, key: TileKey): number {
        const yMax = this.selectedConfig.yRows - 1;
        const xMax = this.selectedConfig.xRows - 1;
        let itemAroundTile = 0;

        if (y > 0) {
            if (x > 0) {
                if (this.rows[y - 1][x - 1][key]) {
                    itemAroundTile++;
                }
            }
            if (x < xMax) {
                if (this.rows[y - 1][x + 1][key]) {
                    itemAroundTile++;
                }
            }
            if (this.rows[y - 1][x][key]) {
                itemAroundTile++;
            }
        }

        if (x > 0) {
            if (this.rows[y][x - 1][key]) {
                itemAroundTile++;
            }
        }
        if (x < xMax) {
            if (this.rows[y][x + 1][key]) {
                itemAroundTile++;
            }
        }

        if (y < yMax) {
            if (x > 0) {
                if (this.rows[y + 1][x - 1][key]) {
                    itemAroundTile++;
                }
            }
            if (x < xMax) {
                if (this.rows[y + 1][x + 1][key]) {
                    itemAroundTile++;
                }
            }
            if (this.rows[y + 1][x][key]) {
                itemAroundTile++;
            }
        }

        return itemAroundTile;
    }

    public flagTile(y: number, x: number): void {
        const tile = {y, x};
        const index = this.minesCoords.findIndex(coords => coords.y === tile.y && coords.x === tile.x);

        this.rows[y][x].isFlagged = !this.rows[y][x].isFlagged;
        this.totalFlagged = this.rows[y][x].isFlagged ? this.totalFlagged + 1 : this.totalFlagged - 1;

        if (index >= 0) {
            this.minesCoords.splice(index, 1);

            if (this.minesCoords.length === 0) {
                this.shouldEndGame = {isGameOver: true, reason: EndGameEnum.WIN};
            }
        } else {
            this.minesCoords.push(tile);
        }

    }

    public verifyAllTilesClicked(): void {
        for (let y = 0; y < this.selectedConfig.yRows; y++) {
            for (let x = 0; x < this.selectedConfig.xRows; x++) {
                if (!this.rows[y][x].isClicked && !this.rows[y][x].isMine) {
                    return;
                }
            }
        }

        this.shouldEndGame = {isGameOver: true, reason: EndGameEnum.WIN};
    }

    public revealBoard(safeMode: EndGameEnum): void {
        this.rows.forEach(row => {
            row.forEach(tile => {
                if (tile.isMine || tile.isFlagged) {
                    if (safeMode) {
                        tile.isFlagged = true;
                    }

                    tile.isClicked = true;
                }
            });
        });
    }

    private initRows(): void {
        this.rows = Array.from({length: this.selectedConfig.yRows});

        for (let y = 0; y < this.selectedConfig.yRows; y++) {
            this.rows[y] = Array.from({length: this.selectedConfig.xRows}, () => new Tile());
        }
    }

    private setMines(): void {
        for (let minesSettled = 0; minesSettled < this.selectedConfig.mines;) {
            const rand1 = Math.floor(Math.random() * this.selectedConfig.yRows);
            const rand2 = Math.floor(Math.random() * this.selectedConfig.xRows);

            if (!this.rows[rand1][rand2].isMine) {
                minesSettled++;
                this.rows[rand1][rand2].isMine = true;
                this.minesCoords.push({y: rand1, x: rand2});
            }
        }
    }

    private calculateValues(): void {
        for (let y = 0; y < this.selectedConfig.yRows; y++) {
            for (let x = 0; x < this.selectedConfig.xRows; x++) {
                if (!this.rows[y][x].isMine) {
                    this.rows[y][x].value = this.countAroundTile(y, x, 'isMine');
                }
            }
        }
    }
}
