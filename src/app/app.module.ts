import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoardModule } from './board/board.module';
import { TimerComponent } from './timer/timer.component';


@NgModule({
    imports: [
        BrowserModule,
        BoardModule,
    ],
    declarations: [
        AppComponent,
        TimerComponent,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
