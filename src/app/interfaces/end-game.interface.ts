import { EndGameEnum } from '../enums/end-game.enum';


export interface IEndGame {
    isGameOver: boolean;
    reason?: EndGameEnum;
}
