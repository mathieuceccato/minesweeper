import {IGameConfig} from '../../interfaces/game-config.interface';
import {Difficulty} from '../../enums/difficulty.enum';


export const config: IGameConfig[] = [
    {
        name: 'Easy',
        difficulty: Difficulty.EASY,
        mines: 10, // 8 * 8 = 64 / 10 = 6.4
        xRows: 8,
        yRows: 8,
    },
    {
        name: 'Medium',
        difficulty: Difficulty.MEDIUM,
        mines: 24, // 12 * 12 = 144 / 24 = 6
        xRows: 12,
        yRows: 12,
    },
    {
        name: 'Hard',
        difficulty: Difficulty.HARD,
        mines: 40, // 21 * 12 = 240 / 40 = 6
        xRows: 20,
        yRows: 12,
    },
];
