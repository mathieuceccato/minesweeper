import { IGameConfig } from '../../interfaces/game-config.interface';
import { DifficultyEnum } from '../../enums/difficulty.enum';


export const config: IGameConfig[] = [
    {
        name: 'Easy',
        difficulty: DifficultyEnum.EASY,
        mines: 10,
        xRows: 8,
        yRows: 8,
    },
    {
        name: 'Medium',
        difficulty: DifficultyEnum.MEDIUM,
        mines: 25,
        xRows: 12,
        yRows: 12,
    },
    {
        name: 'Hard',
        difficulty: DifficultyEnum.HARD,
        mines: 35,
        xRows: 20,
        yRows: 12,
    },
] ;
