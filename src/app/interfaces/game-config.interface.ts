import { Difficulty } from '../enums/difficulty.enum';


export interface IGameConfig {
    name: string;
    difficulty: Difficulty;
    mines: number;
    xRows: number;
    yRows: number;
}
