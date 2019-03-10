import { DifficultyEnum } from '../enums/difficulty.enum';


export interface IGameConfig {
    name: string;
    difficulty: DifficultyEnum;
    mines: number;
    xRows: number;
    yRows: number;
}
