import { Component, Input, OnInit } from '@angular/core';
import { ITile } from '../../interfaces/tile.interface';
import { GameService } from '../../services/game.service';
import { distinctUntilChanged } from 'rxjs/operators';


@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
})
export class TileComponent implements OnInit {
    @Input() tile: ITile;
    @Input() x: number;
    @Input() y: number;

    private gameIsOver: boolean = false;

    constructor(private gameService: GameService) {
    }

    public ngOnInit(): void {
        this.gameService.isGameOver()
        .pipe(
            distinctUntilChanged(),
        )
        .subscribe(gameIsOver => this.gameIsOver = gameIsOver);
    }

    public clickTile(e): void {
        e.preventDefault();

        console.log('this.tile', this.tile);

        if (this.tile.isFlagged || this.gameIsOver) {
            return;
        }

        if (this.tile.value === 0) {
            console.log('this.x', this.x);
            console.log('this.y', this.y);
            this.gameService.propagateDiscovery(this.y, this.x);
        }
        this.tile.isClicked = true;
        this.gameService.shouldEndGame = this.tile.isMine;

        // todo: check if game ended. How ? Count inital tiles - mines.
        // todo: On each click, decrease the count
    }

    public onRightClick(e): void {
        e.preventDefault();

        if (this.gameIsOver) {
            return;
        }

        if (this.tile.isClicked) {
            this.gameService.propagateDiscovery(this.y, this.x, true);

            return;
        }

        this.tile.isFlagged = !this.tile.isFlagged;
        // todo: add / remove tile from the mines list. If list is empty, the game is won.
    }
}
