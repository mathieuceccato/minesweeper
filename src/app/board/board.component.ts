import { Component, Input } from '@angular/core';
import { ITile } from '../interfaces/tile.interface';


@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
    @Input() rows: ITile[][];
}
