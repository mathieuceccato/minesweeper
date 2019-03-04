import { Component, Input } from '@angular/core';
import { ITile } from '../../interfaces/tile.interface';
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

    constructor(private gameService: GameService) {
    }

    public clickTile(e): void {
        e.preventDefault();

        if (this.tile.value === 0) {
            console.log('this.x', this.x);
            console.log('this.y', this.y);
            this.gameService.propagateDiscovery(this.y, this.x);
        }
        this.tile.isClicked = true;

    }

    public onRightClick(e): void {
        e.preventDefault();
        // todo
    }
}
