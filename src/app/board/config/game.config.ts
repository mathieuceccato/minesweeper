import { IGameConfig } from '../../interfaces/game-config.interface';
import { DifficultyEnum } from '../../enums/difficulty.enum';


export const config: IGameConfig[] = [
    {
        name: 'Easy',
        difficulty: DifficultyEnum.EASY, // 8 * 8 = 64 / 10 = 6.4
        mines: 10,
        xRows: 8,
        yRows: 8,
    },
    {
        name: 'Medium',
        difficulty: DifficultyEnum.MEDIUM, // 12 * 12 = 144 / 24 = 6
        mines: 24,
        xRows: 12,
        yRows: 12,
    },
    {
        name: 'Hard',
        difficulty: DifficultyEnum.HARD, // 21 * 12 = 240 / 40 = 6
        mines: 40,
        xRows: 20,
        yRows: 12,
    },
] ;
