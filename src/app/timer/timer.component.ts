import {Component, OnInit} from '@angular/core';
import {GameService} from '../services/game.service';
import {combineLatest} from 'rxjs';


@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
    public timer: number = 0;

    private timerHandler: any;

    constructor(private gameService: GameService) {
    }

    ngOnInit() {
        combineLatest(
            this.gameService.isGameStarted(),
            this.gameService.isGameOver(),
        )
        .subscribe(([gameHasStarted, endGame]) => {
                if (gameHasStarted && !endGame.isGameOver) {
                    this.startTimer();
                } else if (endGame.isGameOver) {
                    this.stopTimer();
                } else if (!gameHasStarted) {
                    this.resetTimer();
                }
            });
    }

    private startTimer(): void {
        if (!this.timerHandler) {
            // this.timer = 0;
            this.timerHandler = setInterval(() => {
                this.timer++;
            }, 1000);
        }
    }

    private stopTimer(): void {
        if (this.timerHandler) {
            clearInterval(this.timerHandler);
            this.timerHandler = null;
        }
    }

    private resetTimer(): void {
        this.timer = 0;
    }

}
