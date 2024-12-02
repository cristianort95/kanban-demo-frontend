import {Component, computed, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconButton} from "@angular/material/button";
import {CustomSidenavComponent} from "./shared/components/custom-sidenav/custom-sidenav.component";
import {NgxSpinnerComponent} from "ngx-spinner";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    NgxSpinnerComponent
  ],
  styleUrl: './app.component.sass'
})
export class AppComponent {
}
