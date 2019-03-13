import { Component, Input } from '@angular/core';

import { ITile } from '../../interfaces/tile.interface';
import { TileService } from '../../services/tile.service';
import { GameService } from '../../services/game.service';


@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
})
export class TileComponent {
    @Input() tile: ITile;
    @Input() x: number;
    @Input() y: number;

    constructor(private gameService: GameService,
                private tileService: TileService) {
    }

    public clickTile(e): void {
        e.preventDefault();

        if (this.tile.isFlagged) {
            return;
        }
        console.log('this.tile', this.tile);
        this.tileService.handleClick(this.y, this.x);
    }

    public clickRight(e): void {
        e.preventDefault();

        this.tileService.handleRightClick(this.y, this.x);
    }
}
