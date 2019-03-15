import {ITile} from '../interfaces/tile.interface';


export class Tile implements ITile {
    public isMine: boolean = false;
    public value: number = null;
    public isClicked: boolean = false;
    public isFlagged: boolean = false;
}
