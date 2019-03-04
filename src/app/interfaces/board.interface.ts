import { ITile } from './tile.interface';


export interface IBoard {
    rows: ITile[][];
    timer: number;
    gameHasStarted: boolean;
}
