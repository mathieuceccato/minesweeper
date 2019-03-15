import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardComponent} from './board.component';
import {TileComponent} from './tile/tile.component';


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        BoardComponent,

        TileComponent,
    ],
    exports: [
        BoardComponent,
    ],
})
export class BoardModule {
}
