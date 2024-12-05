import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgxSpinnerComponent} from "ngx-spinner";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        RouterOutlet,
        NgxSpinnerComponent
    ],
    styleUrl: './app.component.sass'
})
export class AppComponent {
}
