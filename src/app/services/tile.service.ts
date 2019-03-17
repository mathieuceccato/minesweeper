import { Injectable } from '@angular/core';

import { distinctUntilChanged } from 'rxjs/operators';

import { GameService } from './game.service';
import { EndGameEnum } from '../enums/end-game.enum';
import {ITile} from '../interfaces/tile.interface';


@Injectable({
    providedIn: 'root',
})
export class TileService {
    private gameIsOver: boolean = false;

    constructor(private gameService: GameService) {
        this.gameService.isGameOver()
        .pipe(
            distinctUntilChanged(),
        )
        .subscribe(endGame => this.gameIsOver = endGame.isGameOver);
    }

    public handleClick(y: number, x: number): void {
        if (this.gameIsOver) {
            return;
        }

        const tile: ITile = this.gameService.rows[y][x];

        if (tile.value === 0) {
            this.gameService.propagateDiscovery(y, x);
        }
        tile.isClicked = true;

        if (tile.isMine) {
            this.gameService.shouldEndGame = {isGameOver: true, reason: EndGameEnum.LOOSE};
            return;
        }

        this.gameService.verifyAllTilesClicked();
    }

    public handleRightClick(y: number, x: number): void {
        if (this.gameIsOver) {
            return;
        }

        const tile = this.gameService.rows[y][x];

        if (tile.isClicked) {
            if (this.gameService.countAroundTile(y, x, 'isFlagged') >= tile.value) {
                this.gameService.propagateDiscovery(y, x, true);
            }

            return;
        }

        this.gameService.flagTile(y, x);
    }
}
